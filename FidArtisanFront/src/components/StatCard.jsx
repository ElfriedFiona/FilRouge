const StatCard = ({ title, value, icon, bgColor }) => (
    <div className={`p-6 rounded-xl shadow-md ${bgColor} text-white flex justify-between items-center`}>
      <div>
        <h4 className="text-sm">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
  export default StatCard;
  