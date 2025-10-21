import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  searchUsers,
  toggleUserActive,
  deleteUser,
  editUser,
} from "../../redux/actions/postsActions";

const PAGE_SIZE = 10;

export default function AdminUserPanel() {
  const dispatch = useDispatch();

  // Traemos user y lista de usuarios del store
  const { user, users, usersLoading } = useSelector((state) => state.posts);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    admin: false,
    editor: false,
    premium: false,
    active: null,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Si no hay user o no es admin, bloquea el acceso
  if (!user || !user.roles?.admin) {
    return (
      <div className="p-4 text-center text-red-500">
        🚫 No tienes permisos para acceder a este panel.
      </div>
    );
  }

  // 🔹 Obtener usuarios al montar
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // 🔹 Actualizar lista filtrada cada vez que cambia la lista global
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // 🔹 Buscar usuarios
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return applyFilters(users);
    dispatch(searchUsers(search));
  };

  // 🔹 Aplicar filtros (local, no API)
  const applyFilters = (list) => {
    let filtered = [...list];

    ["admin", "editor", "premium"].forEach((role) => {
      if (filters[role]) filtered = filtered.filter((u) => u[role]);
    });

    if (filters.active !== null) {
      filtered = filtered.filter((u) => u.active === filters.active);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // 🔹 Cambiar estado activo
  const handleToggleActive = (id, active) => {
    dispatch(toggleUserActive(id, active));
  };

  // 🔹 Eliminar usuario
  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
  };

  // 🔹 Preparar datos para editar
  const selectForEdit = (user) => {
    setSelectedUser(user);
    setEditData({
      user_name: user.user_name,
      mail: user.mail,
      password: "",
      admin: user.admin,
      editor: user.editor,
      premium: user.premium,
      active: user.active,
    });
  };

  // 🔹 Guardar cambios en edición
const saveEdit = () => {
  const cleanData = { ...editData };
  if (!cleanData.password) delete cleanData.password;

  dispatch(editUser(selectedUser.user_id, cleanData));
  setSelectedUser(null);
};

  // 🔹 Paginación
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">👥 Panel de Usuarios</h1>

      {/* 🔍 Búsqueda */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Buscar
        </button>
      </form>

      {/* 🛠 Filtros */}
      <div className="flex gap-4 mb-4 items-center">
        {["admin", "editor", "premium"].map((role) => (
          <label key={role} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={filters[role]}
              onChange={() => setFilters({ ...filters, [role]: !filters[role] })}
            />
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </label>
        ))}
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={filters.active === true}
            onChange={() =>
              setFilters({
                ...filters,
                active: filters.active === true ? null : true,
              })
            }
          />
          Activos
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={filters.active === false}
            onChange={() =>
              setFilters({
                ...filters,
                active: filters.active === false ? null : false,
              })
            }
          />
          Inactivos
        </label>
        <button
          className="bg-gray-300 px-2 py-1 rounded-lg"
          onClick={() => applyFilters(users)}
        >
          Aplicar filtros
        </button>
      </div>

      {/* 🌀 Loading */}
      {usersLoading && <p className="text-gray-500">Cargando usuarios...</p>}

      {/* 📋 Tabla */}
      {!usersLoading && (
        <>
          <table className="min-w-full border mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-black p-2 border">ID</th>
                <th className="text-black p-2 border">Nombre</th>
                <th className="text-black p-2 border">Email</th>
                <th className="text-black p-2 border">Roles</th>
                <th className="text-black p-2 border">Activo</th>
                <th className="text-black p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.user_id} className="text-center">
                  <td className="border p-2">{u.user_id}</td>
                  <td className="border p-2">{u.user_name}</td>
                  <td className="border p-2">{u.mail}</td>
                  <td className="border p-2">
                    {u.admin && "👑 Admin "}
                    {u.editor && "✏️ Editor "}
                    {u.premium && "💎 Premium "}
                    {!u.admin && !u.editor && !u.premium && "—"}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleToggleActive(u.user_id, u.active)}
                      className={`px-3 py-1 rounded-lg text-black ${
                        u.active ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      {u.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => selectForEdit(u)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.user_id)}
                      className="bg-red-500 hover:bg-red-600 text-black px-3 py-1 rounded-lg"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔢 Paginación */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* ✏️ Modal de edición */}
      {selectedUser && (
        <div className="text-black fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              Editar usuario #{selectedUser.user_id}
            </h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={editData.user_name}
                onChange={(e) =>
                  setEditData({ ...editData, user_name: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={editData.mail}
                onChange={(e) =>
                  setEditData({ ...editData, mail: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="password"
                placeholder="Nueva contraseña (opcional)"
                value={editData.password}
                onChange={(e) =>
                  setEditData({ ...editData, password: e.target.value })
                }
                className="border p-2 rounded"
              />

              {/* Roles */}
              <div className="flex gap-4">
                {["admin", "editor", "premium"].map((role) => (
                  <label key={role} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={editData[role]}
                      onChange={() =>
                        setEditData({ ...editData, [role]: !editData[role] })
                      }
                    />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </label>
                ))}
              </div>

              {/* Estado */}
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={editData.active}
                  onChange={() =>
                    setEditData({ ...editData, active: !editData.active })
                  }
                />
                Activo
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 text-black rounded-lg"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
