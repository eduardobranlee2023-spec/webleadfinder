import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  MessageSquare, 
  Star, 
  Zap, 
  TrendingUp, 
  Navigation,
  Loader2,
  Building2,
  CheckCircle2,
  XCircle
} from 'lucide-react';

/**
 * Lead Finder Pro Sur - Base de Datos Expandida
 * Aplicación de práctica para identificar oportunidades de digitalización.
 * Optimizada para despliegue en Vercel.
 */
const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filterZone, setFilterZone] = useState('Todas');
  const [scanProgress, setScanProgress] = useState(0);

  // Base de datos expandida con más de 20 negocios de la zona
  const businessesDB = [
    // MONTE GRANDE
    { id: 1, name: "Odontología Integral MG", type: "Salud", zone: "Monte Grande", address: "Vicente López 150", phone: "5491122334455", hasWebsite: true, rating: 4.8, reviews: 120, opportunity: "Optimizar formulario con Chatbot IA" },
    { id: 2, name: "Pizzería La Central", type: "Gastronomía", zone: "Monte Grande", address: "Alem 450", phone: "5491177889900", hasWebsite: false, rating: 4.6, reviews: 450, opportunity: "Menú QR + Pedidos automáticos" },
    { id: 3, name: "Veterinaria El Trébol", type: "Mascotas", zone: "Monte Grande", address: "Dorrego 120", phone: "5491144002233", hasWebsite: false, rating: 4.4, reviews: 85, opportunity: "Sistema de turnos para vacunas" },
    { id: 4, name: "Estudio Jurídico Santillán", type: "Servicios", zone: "Monte Grande", address: "Las Heras 320", phone: "5491155998877", hasWebsite: true, rating: 4.9, reviews: 42, opportunity: "Gestión de documentos con IA" },
    { id: 5, name: "Heladería Artesanal MG", type: "Gastronomía", zone: "Monte Grande", address: "Dardo Rocha 100", phone: "5491133221144", hasWebsite: false, rating: 4.7, reviews: 890, opportunity: "Programa de fidelización digital" },

    // CANNING
    { id: 6, name: "Gimnasio Power Canning", type: "Deportes", zone: "Canning", address: "Mariano Castex 1500", phone: "5491144556677", hasWebsite: true, rating: 4.5, reviews: 89, opportunity: "Gestión de reseñas negativas" },
    { id: 7, name: "Sushi Premium Canning", type: "Gastronomía", zone: "Canning", address: "Las Toscas", phone: "5491188990011", hasWebsite: true, rating: 4.3, reviews: 310, opportunity: "Reservas de mesa automáticas" },
    { id: 8, name: "Barbería The King", type: "Belleza", zone: "Canning", address: "Castex 100", phone: "5491144116633", hasWebsite: false, rating: 4.9, reviews: 200, opportunity: "App de turnos propia" },
    { id: 9, name: "Vivero Amanecer", type: "Hogar", zone: "Canning", address: "Ruta 58", phone: "5491122446688", hasWebsite: false, rating: 4.6, reviews: 150, opportunity: "Catálogo de plantas en Instagram" },
    { id: 10, name: "Estética Avanzada Las Toscas", type: "Belleza", zone: "Canning", address: "Shopping Las Toscas", phone: "5491155001122", hasWebsite: true, rating: 4.8, reviews: 75, opportunity: "Recordatorios de citas por WhatsApp" },

    // EZEIZA
    { id: 11, name: "Centro Médico Ezeiza", type: "Salud", zone: "Ezeiza", address: "Av. Perón 300", phone: "5491166778899", hasWebsite: true, rating: 4.0, reviews: 210, opportunity: "Voz IA para recepción" },
    { id: 12, name: "Repuestos Ezeiza", type: "Automotor", zone: "Ezeiza", address: "Ruta 205", phone: "5491199887766", hasWebsite: false, rating: 3.8, reviews: 15, opportunity: "Catálogo interactivo en Web" },
    { id: 13, name: "Ferretería Central Ezeiza", type: "Hogar", zone: "Ezeiza", address: "Paso de la Patria 450", phone: "5491144332211", hasWebsite: false, rating: 4.2, reviews: 56, opportunity: "Venta online por catálogo PDF" },
    { id: 14, name: "Parrilla El Encuentro", type: "Gastronomía", zone: "Ezeiza", address: "Autopista Richieri km 25", phone: "5491188776655", hasWebsite: false, rating: 4.5, reviews: 1200, opportunity: "Sistema de pedidos para llevar" },

    // LUIS GUILLÓN
    { id: 15, name: "Taller Mecánico Guillón", type: "Automotor", zone: "Luis Guillón", address: "Bv. Buenos Aires 1200", phone: "5491133445566", hasWebsite: false, rating: 4.2, reviews: 25, opportunity: "Turnos por WhatsApp Web" },
    { id: 16, name: "Panadería La Nueva", type: "Gastronomía", zone: "Luis Guillón", address: "Antártida Argentina", phone: "5491155667733", hasWebsite: false, rating: 4.3, reviews: 112, opportunity: "Pedidos de viandas por Web" },
    { id: 17, name: "Librería del Sur", type: "Comercio", zone: "Luis Guillón", address: "Madariaga 500", phone: "5491122337744", hasWebsite: false, rating: 4.5, reviews: 30, opportunity: "Tienda escolar online" },

    // EL JAGÜEL
    { id: 18, name: "Materiales El Jagüel", type: "Comercio", zone: "El Jagüel", address: "Ruta 205", phone: "5491155667788", hasWebsite: false, rating: 3.9, reviews: 12, opportunity: "Visibilidad en Google Maps" },
    { id: 19, name: "Supermercado Los Primos", type: "Comercio", zone: "El Jagüel", address: "Evita 1200", phone: "5491133224455", hasWebsite: false, rating: 4.1, reviews: 210, opportunity: "Lista de precios digital" },
    { id: 20, name: "Gomería Integral", type: "Automotor", zone: "El Jagüel", address: "Feria de El Jagüel", phone: "5491166554433", hasWebsite: false, rating: 4.4, reviews: 18, opportunity: "Marketing local en Facebook" }
  ];

  const handleSearch = () => {
    setIsSearching(true);
    setSelectedLead(null);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const filtered = businessesDB.filter(b => {
            const matchesQuery = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 b.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesZone = filterZone === 'Todas' || b.zone === filterZone;
            return matchesQuery && matchesZone;
          });
          setLeads(filtered);
          setIsSearching(false);
          return 100;
        }
        return prev + 10;
      });
    }, 50);
  };

  const openWhatsApp = (lead) => {
    const msg = encodeURIComponent(`Hola ${lead.name}, soy vecino de la zona y ayudo a comercios de ${lead.zone} a crecer con IA. Vi una oportunidad para mejorar su sistema de atención. ¿Podemos charlar?`);
    window.open(`https://wa.me/${lead.phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg shrink-0">
        <div className="flex items-center gap-2 font-black text-xl italic tracking-tighter">
          <Zap className="text-blue-400 fill-current" size={24} />
          <span>LEAD<span className="text-blue-400">SUR</span> PRO</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 uppercase tracking-widest text-slate-300">
          <Navigation size={12} className="text-blue-400" />
          Radar Online
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar / Lista */}
        <div className="w-full md:w-[400px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
          <div className="p-4 border-b space-y-3 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Rubro o nombre..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:ring-2 ring-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['Todas', 'Monte Grande', 'Canning', 'Ezeiza', 'Luis Guillón', 'El Jagüel'].map(z => (
                <button 
                  key={z}
                  onClick={() => setFilterZone(z)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border ${filterZone === z ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'}`}
                >
                  {z}
                </button>
              ))}
            </div>

            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
              {isSearching ? "Escaneando..." : "Escanear Zona"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
            {leads.map(lead => (
              <div 
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedLead?.id === lead.id ? 'bg-white border-blue-500 shadow-md scale-[1.01]' : 'bg-white border-transparent shadow-sm hover:border-blue-100'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sm text-slate-800">{lead.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold">
                    <Star size={10} className="fill-current" /> {lead.rating}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold mb-2 italic">
                  <MapPin size={10} /> {lead.zone}
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">{lead.type}</span>
                   <span className={`text-[9px] font-black ${lead.hasWebsite ? 'text-green-500' : 'text-red-400'}`}>
                    {lead.hasWebsite ? 'WEB ✓' : 'SIN WEB ✗'}
                   </span>
                </div>
              </div>
            ))}
            {!isSearching && leads.length === 0 && (
              <div className="text-center py-10 opacity-30">
                <Building2 className="mx-auto mb-2" />
                <p className="text-[10px] font-bold uppercase">Sin resultados</p>
              </div>
            )}
          </div>
        </div>

        {/* Detalle del Lead */}
        <div className="flex-1 bg-white md:bg-slate-100 p-4 md:p-8 overflow-y-auto">
          {selectedLead ? (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedLead.name}</h2>
                    <p className="text-slate-400 font-bold text-xs mt-1 flex items-center gap-1">
                      <MapPin size={14} className="text-blue-500" /> {selectedLead.address}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${selectedLead.hasWebsite ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {selectedLead.hasWebsite ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Presencia Digital</p>
                    <p className="font-bold text-slate-800">{selectedLead.hasWebsite ? 'Sitio Activo' : 'Oportunidad de Web'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Reseñas</p>
                    <p className="font-bold text-slate-800">{selectedLead.reviews} en Google</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 text-white rounded-[2rem] p-8 shadow-xl shadow-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={20} className="text-blue-200" />
                  <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-blue-100">Plan de Acción Sugerido</span>
                </div>
                <h4 className="text-2xl font-black leading-tight mb-4 tracking-tight">
                  {selectedLead.opportunity}
                </h4>
                <p className="text-blue-100 text-sm font-medium opacity-80 italic">
                  "Hola, noté que en {selectedLead.name} podrían automatizar procesos para no perder clientes en la zona de {selectedLead.zone}..."
                </p>
              </div>

              <button 
                onClick={() => openWhatsApp(selectedLead)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <MessageSquare size={22} /> ENVIAR PROPUESTA
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <Zap size={60} className="opacity-10 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Selecciona un negocio</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;