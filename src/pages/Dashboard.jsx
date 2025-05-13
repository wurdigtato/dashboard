import React, {useState} from 'react';
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   Tooltip,
   Legend,
   PieChart,
   Pie,
   Cell,
} from 'recharts';
import data from '../data/dados.json';

const Dashboard = () => {
   const [activeIndex, setActiveIndex] = useState(null);

   const toggleAccordion = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
   };

   // Transformação dos dados para os gráficos
   const barChartData = Object.entries(
      data.reduce((acc, item) => {
         acc[item.perfil] = (acc[item.perfil] || 0) + 1;
         return acc;
      }, {})
   ).map(([name, value]) => ({name, value}));

   const pieChartData = Object.entries(
      data.reduce((acc, item) => {
         // Lista de conjunções a serem excluídas
         const conjunctions = [
            'nenhum',
            'chame',
            'e',
            'ou',
            'mas',
            'a',
            'o',
            'de',
            'da',
            'do',
            'em',
            'para',
            'com',
            'sem',
            'por',
            'que',
         ];

         // Divide as respostas em palavras, substitui " e " por vírgulas e remove conjunções
         const designParts = item.designIdeal
            .replace(/\se\s/gi, ',') // Substitui " e " por ","
            .split(/[\s,]+/) // Divide por espaços ou vírgulas
            .map((part) => part.trim().toLowerCase()) // Remove espaços e converte para minúsculas
            .filter((word) => word && !conjunctions.includes(word)); // Remove conjunções e palavras vazias

         // Conta a frequência de cada palavra
         designParts.forEach((part) => {
            acc[part] = (acc[part] || 0) + 1;
         });
         return acc;
      }, {})
   )
      .map(([name, value]) => ({name, value})) // Transforma em array de objetos
      .filter((entry) => entry.value > 1); // Filtra palavras com mais de uma ocorrência

   const phoneBrandData = Object.entries(
      data.reduce((acc, item) => {
         const brand = item.marcaCelular?.toLowerCase().trim(); // Normaliza a marca do celular
         if (brand) {
            acc[brand] = (acc[brand] || 0) + 1; // Conta a frequência de cada marca
         }
         return acc;
      }, {})
   ).map(([name, value]) => ({name, value})); // Transforma em array de objetos

   const labelMap = {
      timestamp: 'Data e Hora',
      perfil: 'Perfil',
      designIdeal: 'Design Ideal',
      appsReferencia: 'Apps de Referência',
      marcaCelular: 'Marca do Celular',
      usaPCparaOfertas: 'Usa PC para Ofertas',
      requisitosExcluir: 'Requisitos a Excluir',
   };

   const COLORS = [
      '#0088FE',
      '#00C49F',
      '#FFBB28',
      '#FF8042',
      '#FF6384',
      '#36A2EB',
   ];

   return (
      <div className="p-6 bg-slate-900 text-white min-h-screen">
         <h1 className="text-4xl text-amber-500 text-center font-bold mb-6">
            Dashboard - Formulário de Levantamento de Requesitos
         </h1>

         {/* Accordion */}
         <div className="space-y-4 py-12">
            <h2 className="text-2xl">Respostas</h2>
            {data.map((item, index) => (
               <div
                  key={index}
                  className="border rounded-lg shadow overflow-clip"
               >
                  <button
                     className="w-full text-left px-4 py-2 bg-gray-100/40 text-gray-100 hover:bg-amber-500/50 font-medium"
                     onClick={() => toggleAccordion(index)}
                  >
                     {`Registro ${index + 1} - ${item.perfil}`}
                  </button>
                  {activeIndex === index && (
                     <div className="p-4 bg-white text-slate-900">
                        <ul className="list-disc pl-6">
                           {Object.entries(item).map(([key, value], i) => (
                              <li key={i}>
                                 <strong>{labelMap[key] || key}:</strong>{' '}
                                 {value}
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}
               </div>
            ))}
         </div>

         {/* Charts */}
         <h2 className="text-2xl">Gráficos</h2>
         <div className="mt-8 flex flex-wrap gap-8">
            {/* Bar Chart */}
            <div className="p-4 border rounded-lg shadow bg-white">
               <h2 className="text-lg font-semibold mb-4">
                  Distribuição por Perfil
               </h2>
               <BarChart width={400} height={300} data={barChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="perfil" />
               </BarChart>
            </div>

            {/* Pie Chart */}
            <div className="p-4 border rounded-lg shadow bg-white">
               <h2 className="text-lg font-semibold mb-4">
                  Preferências de Design
               </h2>
               <PieChart width={400} height={300}>
                  <Pie
                     data={pieChartData}
                     dataKey="value"
                     nameKey="name"
                     cx="50%"
                     cy="50%"
                     outerRadius={100}
                     fill="#8884d8"
                     label
                  >
                     {pieChartData.map((entry, index) => (
                        <Cell
                           key={`cell-${index}`}
                           fill={COLORS[index % COLORS.length]}
                        />
                     ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
               </PieChart>
            </div>
            {/* Phone Brand Straight Angle Pie Chart */}
            <div className="p-4 border rounded-lg shadow bg-white">
               <h2 className="text-lg font-semibold mb-4">
                  Distribuição por Marca de Celular
               </h2>
               <PieChart width={400} height={300}>
                  <Pie
                     data={phoneBrandData}
                     dataKey="value"
                     nameKey="name"
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     startAngle={180} // Começa no topo (ângulo reto)
                     endAngle={0} // Termina no lado direito
                     fill="#82ca9d"
                     paddingAngle={5}
                     label
                  >
                     {phoneBrandData.map((entry, index) => (
                        <Cell
                           key={`cell-${index}`}
                           fill={COLORS[index % COLORS.length]}
                        />
                     ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
               </PieChart>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
