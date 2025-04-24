const UserTable = ({ title, data }) => (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Nom</th><th>Email</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, i) => (
            <tr key={i} className="border-t">
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><button className="text-blue-600">Voir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  export default UserTable;
  