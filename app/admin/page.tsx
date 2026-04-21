export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-950 border-r border-gray-800 p-6">
          <h1 className="text-xl font-bold text-white mb-8">Admin</h1>
          <nav className="space-y-4">
            <a href="#" className="block px-4 py-2 rounded bg-blue-600 text-white font-medium">Dashboard</a>
            <a href="#" className="block px-4 py-2 rounded text-gray-400 hover:text-white transition">Posts</a>
            <a href="#" className="block px-4 py-2 rounded text-gray-400 hover:text-white transition">Comentários</a>
            <a href="#" className="block px-4 py-2 rounded text-gray-400 hover:text-white transition">Newsletter</a>
          </nav>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-800 bg-gray-900 px-8 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition">Logout</button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Posts Publicados', value: '3' },
                { label: 'Comentários Pendentes', value: '0' },
                { label: 'Subscribers', value: '0' },
                { label: 'Views Este Mês', value: '0' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">{item.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Posts Recentes</h3>
              <p className="text-gray-400">Painel admin completo - será implementado com Supabase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
