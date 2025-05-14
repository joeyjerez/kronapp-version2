import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays, subDays, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from "recharts";

// Datos de glucosa simulados para una semana
const mockGlucoseData = [
  { value: 95, date: subDays(new Date(), 6) },
  { value: 120, date: subDays(new Date(), 5) },
  { value: 105, date: subDays(new Date(), 4) },
  { value: 145, date: subDays(new Date(), 3) },
  { value: 130, date: subDays(new Date(), 2) },
  { value: 110, date: subDays(new Date(), 1) },
  { value: 125, date: new Date() },
];

export default function DiabetesModule() {
  const [startDate, setStartDate] = useState(subDays(new Date(), 6));
  const [endDate, setEndDate] = useState(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [glucoseValue, setGlucoseValue] = useState("");
  const [glucoseReadings, setGlucoseReadings] = useState<{value: number, date: Date}[]>(mockGlucoseData);

  const dateRangeText = `${format(startDate, "d 'de' MMMM", { locale: es })} al ${format(endDate, "d 'de' MMMM", { locale: es })}`;

  // Datos simulados para varias semanas
  const weekMinus1 = [
    { value: 115, date: subDays(new Date(), 13) },
    { value: 132, date: subDays(new Date(), 12) },
    { value: 98, date: subDays(new Date(), 11) },
    { value: 127, date: subDays(new Date(), 10) },
    { value: 140, date: subDays(new Date(), 9) },
    { value: 119, date: subDays(new Date(), 8) },
    { value: 105, date: subDays(new Date(), 7) },
  ];

  const weekMinus2 = [
    { value: 110, date: subDays(new Date(), 20) },
    { value: 128, date: subDays(new Date(), 19) },
    { value: 135, date: subDays(new Date(), 18) },
    { value: 142, date: subDays(new Date(), 17) },
    { value: 118, date: subDays(new Date(), 16) },
    { value: 105, date: subDays(new Date(), 15) },
    { value: 122, date: subDays(new Date(), 14) },
  ];
  
  const getWeekData = (start: Date, end: Date) => {
    // Calculamos cuántas semanas hacia atrás estamos
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(diffDays / 7);
    
    switch(weeksDiff) {
      case 0:
        return mockGlucoseData;
      case 1:
        return weekMinus1;
      case 2:
        return weekMinus2;
      default:
        // Para semanas sin datos, retornamos un array vacío
        return [];
    }
  };

  useEffect(() => {
    const weekData = getWeekData(startDate, endDate);
    setGlucoseReadings(weekData);
  }, [startDate, endDate]);

  const goToPreviousWeek = () => {
    setStartDate(subDays(startDate, 7));
    setEndDate(subDays(endDate, 7));
  };

  const goToNextWeek = () => {
    // No permitir ir más allá de la semana actual
    const nextStartDate = addDays(startDate, 7);
    if (nextStartDate <= new Date()) {
      setStartDate(nextStartDate);
      setEndDate(addDays(endDate, 7));
    }
  };

  const addGlucoseReading = () => {
    const value = parseFloat(glucoseValue);
    if (!isNaN(value)) {
      setGlucoseReadings([...glucoseReadings, { value, date: new Date() }]);
      setGlucoseValue("");
      setShowAddDialog(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Barra lateral - oculta en móviles, visible en tabletas y escritorio */}
      <div className="hidden md:block md:w-[220px] bg-[--gray-light] border-r border-gray-200 py-4 px-2">
        <div className="mb-8 px-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[--red-alert] rounded-md flex items-center justify-center shadow-sm">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M8 3.5C5.2 3.5 3 5.7 3 8.5C3 12 5.5 15 12 20.5C18.5 15 21 12 21 8.5C21 5.7 18.8 3.5 16 3.5C14.3 3.5 12.9 4.3 12 5.5C11.1 4.3 9.7 3.5 8 3.5Z" 
                  stroke="currentColor" 
                  strokeWidth="1.8" 
                  fill="none"
                />
              </svg>
            </div>
            <span className="font-semibold text-[--blue-main]">CronApp</span>
          </div>
        </div>

        <p className="px-4 text-xs font-medium text-[--gray-medium] uppercase tracking-wider mb-2">Mis módulos</p>
        <nav className="space-y-1">
          <a href="/patient-profile-new" className="flex items-center py-2 px-4 text-sm text-[--gray-medium] rounded-md hover:bg-[--blue-light] hover:text-[--blue-main] transition-colors">
            <svg className="mr-3 h-5 w-5 text-[--gray-medium]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Inicio
          </a>

          <a href="/diabetes" className="flex items-center py-2 px-4 text-sm bg-[--blue-light] text-[--blue-main] font-medium rounded-md shadow-sm">
            <svg className="mr-3 h-5 w-5 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10v12"></path>
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
            </svg>
            Diabetes
          </a>

          <a href="/hypertension" className="flex items-center py-2 px-4 text-sm text-[--gray-medium] rounded-md hover:bg-[--blue-light] hover:text-[--blue-main] transition-colors">
            <svg className="mr-3 h-5 w-5 text-[--gray-medium]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="8 14 12 10 16 14"></polyline>
            </svg>
            Hipertensión
          </a>
        </nav>

        <Separator className="my-4" />

        <h3 className="px-4 text-xs font-medium text-[--gray-medium] uppercase tracking-wider mb-2">Módulos Educativos</h3>
        <nav className="space-y-1">
          <a href="#" className="flex items-center py-2 px-4 text-sm text-[--gray-medium] rounded-md hover:bg-[--blue-light] hover:text-[--blue-main] transition-colors">
            <svg className="mr-3 h-5 w-5 text-[--gray-medium]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 18 5-3 5 3"></path>
              <path d="M7 6v12"></path>
              <rect x="3" y="6" width="18" height="12" rx="2" ry="2"></rect>
            </svg>
            Videos Educativos
          </a>
        </nav>
      </div>

      {/* Barra de navegación móvil - visible solo en móviles */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[--red-alert] rounded-md flex items-center justify-center shadow-sm">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M8 3.5C5.2 3.5 3 5.7 3 8.5C3 12 5.5 15 12 20.5C18.5 15 21 12 21 8.5C21 5.7 18.8 3.5 16 3.5C14.3 3.5 12.9 4.3 12 5.5C11.1 4.3 9.7 3.5 8 3.5Z" 
                  stroke="currentColor" 
                  strokeWidth="1.8" 
                  fill="none"
                />
              </svg>
            </div>
            <span className="font-semibold text-[--blue-main]">CronApp</span>
          </div>
          
          <div className="flex gap-2">
            <a href="/patient-profile-new" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[--blue-light]">
              <svg className="h-5 w-5 text-[--gray-medium]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </a>
            
            <a href="/diabetes" className="w-10 h-10 flex items-center justify-center rounded-full bg-[--blue-light]">
              <svg className="h-5 w-5 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v12"></path>
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
              </svg>
            </a>
            
            <a href="/hypertension" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[--blue-light]">
              <svg className="h-5 w-5 text-[--gray-medium]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="8 14 12 10 16 14"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 p-4 md:p-6 bg-[--gray-light]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-[--blue-main]">Módulo en proceso</h1>

          <Card className="mb-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="p-3 md:p-4 border-b flex flex-wrap justify-between items-center bg-[--blue-light]/30">
                <h2 className="text-base md:text-lg font-medium text-[--blue-main] w-full sm:w-auto mb-2 sm:mb-0">{dateRangeText}</h2>
              </div>

              <div className="p-4 md:p-6">
                {glucoseReadings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 md:py-12">
                    <div className="relative mb-6">
                      {/* Imagen de portapapeles con mediciones */}
                      <div className="w-32 md:w-40 h-40 md:h-48 bg-[--blue-light]/20 border border-[--blue-light] rounded-lg relative z-10 flex items-center justify-center shadow-sm">
                        <div className="w-24 md:w-32 h-32 md:h-40 bg-white rounded-lg border border-[--blue-light]/50"></div>
                      </div>
                    </div>
                    <p className="text-[--black-soft] font-medium text-center">No tenemos datos para mostrar</p>
                    <p className="text-[--gray-medium] text-sm mt-1 text-center">Haz click aquí para poder agregar datos</p>
                  </div>
                ) : (
                  <div>
                    {/* Altura adaptativa según el dispositivo */}
                    <div className="h-52 sm:h-64 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={glucoseReadings.map(reading => ({
                            ...reading,
                            dayLabel: format(reading.date, "dd/MM"),
                            formattedDate: format(reading.date, "dd/MM/yyyy")
                          }))}
                          margin={{ 
                            top: 5, 
                            right: 30, 
                            left: 5, 
                            bottom: 5 
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="dayLabel" 
                            tick={{ fontSize: 9, fill: 'var(--gray-medium)' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e5e5' }}
                            height={30}
                          />
                          <YAxis 
                            domain={[0, 250]} 
                            tick={{ fontSize: 9, fill: 'var(--gray-medium)' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e5e5' }}
                            width={30}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value} mg/dL`, 'Glucosa']} 
                            labelFormatter={(label) => `Fecha: ${label}`}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e5e5',
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}
                          />
                          {/* Referencias con etiquetas responsivas */}
                          <ReferenceLine 
                            y={180} 
                            stroke="var(--red-alert)" 
                            strokeDasharray="3 3" 
                            label={{ 
                              value: "180", 
                              fill: "var(--red-alert)", 
                              position: "right",
                              fontSize: 10
                            }} 
                          />
                          <ReferenceLine 
                            y={140} 
                            stroke="var(--yellow-warning)" 
                            strokeDasharray="3 3" 
                            label={{ 
                              value: "140", 
                              fill: "var(--yellow-warning)", 
                              position: "right",
                              fontSize: 10
                            }} 
                          />
                          <ReferenceLine 
                            y={70} 
                            stroke="var(--blue-main)" 
                            strokeDasharray="3 3" 
                            label={{ 
                              value: "70", 
                              fill: "var(--blue-main)", 
                              position: "right",
                              fontSize: 10
                            }} 
                          />
                          <Bar 
                            dataKey="value" 
                            name="Glucosa"
                            isAnimationActive={true}
                            animationDuration={500}
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                            fillOpacity={0.9}
                          >
                            {glucoseReadings.map((entry, index) => {
                              let color = 'var(--green-success)';
                              if (entry.value > 180) color = 'var(--red-alert)';
                              else if (entry.value > 140) color = 'var(--yellow-warning)';
                              else if (entry.value < 70) color = 'var(--red-alert)';
                              
                              return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Leyenda adaptativa */}
                    <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4 text-xs mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[--green-success] rounded-sm"></div>
                        <span className="text-[--gray-medium]">Normal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[--yellow-warning] rounded-sm"></div>
                        <span className="text-[--gray-medium]">Elevado</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[--red-alert] rounded-sm"></div>
                        <span className="text-[--gray-medium]">Peligroso</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[--blue-main] rounded-sm"></div>
                        <span className="text-[--gray-medium]">Bajo</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-3 sm:px-4 py-3 flex justify-between items-center bg-[--blue-light]/10">
                <Button 
                  size="sm" 
                  onClick={goToPreviousWeek}
                  className="rounded-full w-8 h-8 sm:w-9 sm:h-9 p-0 border border-[--blue-main]/30 bg-white text-[--blue-main] hover:bg-[--blue-light]"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mx-auto"
                  >
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  <span className="sr-only">Anterior</span>
                </Button>
                
                <span className="text-xs sm:text-sm text-[--gray-medium]">Navegar por semanas</span>
                
                <Button 
                  size="sm" 
                  onClick={goToNextWeek}
                  className="rounded-full w-8 h-8 sm:w-9 sm:h-9 p-0 border border-[--blue-main]/30 bg-white text-[--blue-main] hover:bg-[--blue-light]"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="mx-auto" 
                  >
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  <span className="sr-only">Siguiente</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[--blue-main] hover:bg-[--blue-main]/90 text-white shadow-sm">
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Agregar medición
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] border border-[--blue-light] shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-[--blue-main] text-xl">Agregar medición de glucosa</DialogTitle>
                  <DialogDescription className="text-[--gray-medium]">
                    Introduce tu nivel de azúcar en la sangre en mg/dL.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="glucose" className="text-right text-[--black-soft]">
                      Valor
                    </Label>
                    <Input
                      id="glucose"
                      type="number"
                      value={glucoseValue}
                      onChange={(e) => setGlucoseValue(e.target.value)}
                      className="col-span-3 border-[--blue-light] focus-visible:ring-[--blue-main]"
                      placeholder="Ej. 120"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={addGlucoseReading}
                    className="bg-[--blue-main] hover:bg-[--blue-main]/90 text-white"
                  >
                    Guardar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}