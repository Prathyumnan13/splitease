"use client";
import { useState, useEffect } from "react";
import { getUsers, addUser, deleteUser } from "@/actions/users";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const result = await addUser(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setShowForm(false);
      e.target.reset();
      fetchUsers();
    }
    setFormLoading(false);
  };

  const handleDelete = async (userId) => {
    if (!confirm("Delete this user? This will also delete their expenses.")) return;
    setDeletingId(userId);
    await deleteUser(userId);
    fetchUsers();
    setDeletingId(null);
  };

  const colors = [
    "from-violet-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-pink-500 to-rose-500",
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add up to 4 housemates {users.length > 0 && `(${users.length}/4)`}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Users List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {users.map((user, idx) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800
                border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors[idx % colors.length]}
                flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{user.phone}</p>
              </div>
              <button
                onClick={() => handleDelete(user.id)}
                disabled={deletingId === user.id}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50
                  dark:hover:bg-red-900/30 transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No users yet</p>
              <p className="text-sm text-slate-400 mt-1">Add your housemates to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Add User Form */}
      {showForm ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 animate-scale-in">
          <h3 className="font-semibold mb-4">Add New User</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600
                bg-slate-50 dark:bg-slate-700 text-base placeholder:text-slate-400
                focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
            />
            <input
              type="tel"
              name="phone"
              required
              placeholder="Phone / GPay number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600
                bg-slate-50 dark:bg-slate-700 text-base placeholder:text-slate-400
                focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(""); }}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600
                  text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white
                  bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700
                  disabled:opacity-50 transition shadow-lg shadow-violet-500/25"
              >
                {formLoading ? "Adding..." : "Add User"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        users.length < 4 && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700
              text-sm font-medium text-slate-500 dark:text-slate-400
              hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400
              transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        )
      )}
    </div>
  );
}
