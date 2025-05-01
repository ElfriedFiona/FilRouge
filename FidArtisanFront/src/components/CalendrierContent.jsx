import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../services/api";

const localizer = momentLocalizer(moment);

export default function CalendrierContent() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date()); // Date actuellement affichée

  // Fonction pour charger les événements du mois affiché
  const fetchEvents = async (currentDate) => {
    const month = currentDate.getMonth() + 1; // mois = 1 à 12
    const year = currentDate.getFullYear();

    const res = await api.get(`/calendar-events?month=${month}&year=${year}`);
    const parsed = res.data.map((e) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    }));
    setEvents(parsed);
  };

  useEffect(() => {
    fetchEvents(date);
  }, [date]);

  const handleSelectSlot = async ({ start, end }) => {
    const title = prompt("Titre du rendez-vous :");
    if (title) {
      const { data } = await api.post("/calendar-events", { title, start, end });
      setEvents((prev) => [
        ...prev,
        { ...data, start: new Date(data.start), end: new Date(data.end) },
      ]);
    }
  };

  const handleSelectEvent = async (event) => {
    const action = prompt(
      `Modifier le titre ou taper "supprimer" pour le supprimer.`,
      event.title
    );
    if (!action) return;

    if (action.toLowerCase() === "supprimer") {
      if (confirm("Confirmer la suppression ?")) {
        await api.delete(`/calendar-events/${event.id}`);
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
      }
    } else {
      const updated = { ...event, title: action };
      await api.put(`/calendar-events/${event.id}`, {
        title: action,
        start: updated.start,
        end: updated.end,
      });
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    }
  };

  const handleNavigate = (newDate) => {
    setDate(newDate); // Met à jour le mois affiché => déclenche useEffect
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold text-blue-600 mb-4">Votre Calendrier</h3>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        views={["month", "agenda", "week", "day"]}
        view="month"
        date={date}
        onNavigate={handleNavigate}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}
