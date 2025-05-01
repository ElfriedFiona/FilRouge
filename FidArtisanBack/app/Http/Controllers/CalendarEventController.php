<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\CalendarEvent;
use Illuminate\Http\Request;
use Carbon\Carbon;


class CalendarEventController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $artisan = Auth::user()->artisan;
        return $artisan
            ? response()->json($artisan->calendarEvents)
            : response()->json([], 403);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    

    public function store(Request $request)
    {
    $request->validate([
        'title' => 'required|string|max:255',
        'start' => 'required|date',
        'end' => 'required|date|after_or_equal:start',
    ]);

    $artisan = Auth::user()->artisan;

    if (!$artisan) {
        return response()->json(['error' => 'Non autorisé'], 403);
    }

    $event = CalendarEvent::create([
        'artisan_id' => $artisan->id,
        'title' => $request->title,
        'start' => Carbon::parse($request->start)->format('Y-m-d H:i:s'),
        'end' => Carbon::parse($request->end)->format('Y-m-d H:i:s'),
    ]);

    return response()->json($event, 201);
}


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CalendarEvent  $calendarEvent
     * @return \Illuminate\Http\Response
     */
    public function show(CalendarEvent $calendarEvent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CalendarEvent  $calendarEvent
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CalendarEvent $calendarEvent)
{
    $artisan = Auth::user()->artisan;
    if (!$artisan || $calendarEvent->artisan_id !== $artisan->id) {
        return response()->json(['error' => 'Non autorisé'], 403);
    }

    $request->validate([
        'title' => 'required|string|max:255',
        'start' => 'required|date',
        'end' => 'required|date|after_or_equal:start',
    ]);

    $calendarEvent->update([
        'title' => $request->title,
        'start' => Carbon::parse($request->start)->format('Y-m-d H:i:s'),
        'end' => Carbon::parse($request->end)->format('Y-m-d H:i:s'),
    ]);

    return response()->json($calendarEvent);
}


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CalendarEvent  $calendarEvent
     * @return \Illuminate\Http\Response
     */
    public function destroy(CalendarEvent $calendarEvent)
    {
        $artisan = Auth::user()->artisan;
        if (!$artisan || $calendarEvent->artisan_id !== $artisan->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $calendarEvent->delete();
        return response()->json(['message' => 'Événement supprimé']);
    }

}
