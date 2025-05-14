import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  Cell,
  Legend
} from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// Tipos para los datos del paciente
interface PatientData {
  name: string;
  lastName: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  weight: number;
  height: number;
  isSmoker: boolean;
  insurance: string;
}

// Tipo para medicamentos
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  category: "diabetes" | "hipertension" | "otro";
  adherence: number;
  nextDose: string;
}

export default function PatientProfileNew() {
  // Estado para controlar la visibilidad del sidebar en móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Estado para controlar la visibilidad del botón hamburguesa al hacer scroll
  const [showMenuButton, setShowMenuButton] = useState(true);
  
  // Detector de dispositivo móvil y control de scroll para el botón hamburguesa
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Control de scroll para ocultar/mostrar el botón hamburguesa
    const handleScroll = () => {
      // Si el usuario ha scrolleado más de 100px, ocultamos el botón
      // O si el sidebar está abierto, mantenemos el botón visible
      if (sidebarOpen) {
        setShowMenuButton(true);
      } else {
        setShowMenuButton(window.scrollY < 100);
      }
    };
    
    // Verificar al cargar y cuando cambie el tamaño de la ventana
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sidebarOpen]);
  
  // Estados de diálogos
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [showConfirmLogoutDialog, setShowConfirmLogoutDialog] = useState(false);
  const [showAddMedicationDialog, setShowAddMedicationDialog] = useState(false);
  
  // Estado del paciente
  const [patientData, setPatientData] = useState<PatientData>({
    name: "José",
    lastName: "Ponce Ávila",
    age: 56,
    phone: "(+52) 55 1234 5678",
    email: "joseponce@email.com",
    address: "Av. Insurgentes Sur 1582, CDMX",
    weight: 95,
    height: 175,
    isSmoker: false,
    insurance: "IMSS"
  });
  
  // Estado de medicamentos
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Metformina",
      dosage: "850mg - 1 pastilla después del desayuno y cena",
      frequency: "2 veces al día",
      category: "diabetes",
      adherence: 96,
      nextDose: "Hoy 20:00"
    },
    {
      id: "2",
      name: "Glibenclamida",
      dosage: "5mg - 1 pastilla antes del desayuno",
      frequency: "1 vez al día",
      category: "diabetes",
      adherence: 82,
      nextDose: "Mañana 7:30"
    },
    {
      id: "3",
      name: "Losartán",
      dosage: "50mg - 1 pastilla en la mañana",
      frequency: "1 vez al día",
      category: "hipertension",
      adherence: 100,
      nextDose: "Mañana 8:00"
    }
  ]);
  
  // Datos para gráfico de glucosa
  const glucoseData = [
    { day: 'Lun', value: 105, date: '01/05' },
    { day: 'Mar', value: 125, date: '02/05' },
    { day: 'Mie', value: 115, date: '03/05' },
    { day: 'Jue', value: 145, date: '04/05' },
    { day: 'Vie', value: 130, date: '05/05' },
    { day: 'Sab', value: 110, date: '06/05' },
    { day: 'Dom', value: 125, date: '07/05' },
  ];
  
  // Datos para gráfico de presión arterial
  const bloodPressureData = [
    { day: 'Lun', systolic: 120, diastolic: 80, date: '01/05' },
    { day: 'Mar', systolic: 132, diastolic: 85, date: '02/05' },
    { day: 'Mie', systolic: 128, diastolic: 83, date: '03/05' },
    { day: 'Jue', systolic: 145, diastolic: 90, date: '04/05' },
    { day: 'Vie', systolic: 138, diastolic: 88, date: '05/05' },
    { day: 'Sab', systolic: 130, diastolic: 85, date: '06/05' },
    { day: 'Dom', systolic: 135, diastolic: 87, date: '07/05' },
  ];
  
  // Estado del formulario de nuevo medicamento
  const [newMedication, setNewMedication] = useState<Omit<Medication, "id" | "adherence">>({
    name: "",
    dosage: "",
    frequency: "",
    category: "diabetes",
    nextDose: ""
  });
  
  // Manejador para guardar cambios del perfil
  const handleSaveProfile = () => {
    setShowEditProfileDialog(false);
    toast({
      title: "Perfil actualizado",
      description: "Los datos del perfil han sido actualizados exitosamente.",
    });
  };
  
  // Manejador para agregar medicamento
  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa al menos el nombre y la dosis del medicamento.",
        variant: "destructive"
      });
      return;
    }
    
    const medicationToAdd = {
      ...newMedication,
      id: Date.now().toString(),
      adherence: 100
    };
    
    setMedications([...medications, medicationToAdd]);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      category: "diabetes",
      nextDose: ""
    });
    setShowAddMedicationDialog(false);
    
    toast({
      title: "Medicamento agregado",
      description: `${medicationToAdd.name} ha sido agregado a tu medicación activa.`,
    });
  };
  
  return (
    <div className="relative flex flex-col md:flex-row min-h-screen">
    
      {/* Barra lateral - Cambia en móvil vs desktop */}
      <div className={`${isMobile ? 'fixed z-40 inset-y-0 left-0 transform transition-transform duration-300 ease-in-out' : 'w-[220px]'} 
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'} 
        bg-[--blue-light] border-r py-4 px-2 md:relative md:block`}>
        <div className="mb-8 px-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[--blue-main] rounded-md flex items-center justify-center">
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
            <span className="font-semibold text-[--black-soft]">CronApp</span>
          </div>
        </div>

        <nav className="space-y-1">
          <a href="/patient-profile-new" className="flex items-center py-2 px-4 text-sm bg-[--blue-main] text-white font-medium rounded-md shadow-sm">
            <svg className="mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Inicio
          </a>

          <a href="/diabetes" className="flex items-center py-2 px-4 text-sm text-[--black-soft] rounded-md hover:bg-white hover:shadow-sm transition-all">
            <svg className="mr-3 h-5 w-5 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10v12"></path>
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
            </svg>
            Diabetes
          </a>

          <a href="/hypertension" className="flex items-center py-2 px-4 text-sm text-[--black-soft] rounded-md hover:bg-white hover:shadow-sm transition-all">
            <svg className="mr-3 h-5 w-5 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="8 14 12 10 16 14"></polyline>
            </svg>
            Hipertensión
          </a>
        </nav>

        <Separator className="my-4" />

        <h3 className="px-4 text-xs font-medium text-[--gray-medium] uppercase tracking-wider mb-2">Módulos Educativos</h3>
        <nav className="space-y-1">
          <a href="#" className="flex items-center py-2 px-4 text-sm text-[--black-soft] rounded-md hover:bg-white hover:shadow-sm transition-all">
            <svg className="mr-3 h-5 w-5 text-[--cyan-info]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Videos Educativos
          </a>
        </nav>
      </div>

      {/* Overlay para cerrar el sidebar en móvil cuando está abierto */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 p-4 md:p-6 bg-[--gray-light]">
        <div className="max-w-5xl mx-auto">
          <header className="mb-6">
            <div className="flex items-center mb-4">
              {/* Área izquierda para el botón de hamburguesa en móvil */}
              <div className="flex-1 flex justify-start">
                {isMobile && showMenuButton && (
                  <button 
                    className="p-2 bg-[--blue-main] rounded-md text-white shadow-md transition-opacity duration-300"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <svg 
                      className="h-6 w-6" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      {sidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Área derecha para notificaciones y perfil - siempre alineada a la derecha */}
              <div className="flex justify-end items-center space-x-2 md:space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="flex items-center cursor-pointer hover:bg-[--blue-light]/20 p-2 rounded-lg transition-colors">
                      <div className="relative">
                        <svg className="h-6 w-6 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[--red-alert]"></span>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 mt-1 shadow-lg">
                    <DropdownMenuLabel className="text-[--blue-main] flex justify-between items-center">
                      <span>Notificaciones</span>
                      <span className="bg-[--red-alert] text-white text-xs px-1.5 py-0.5 rounded-full">2</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-64 overflow-y-auto">
                      <DropdownMenuItem className="cursor-pointer p-3 hover:bg-[--blue-light]/10">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-[--black-soft] text-sm">Resultado de análisis listo</span>
                            <span className="text-xs text-[--gray-medium]">Hoy</span>
                          </div>
                          <p className="text-xs text-[--gray-medium]">Su resultado de análisis de glucosa está disponible para revisar.</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer p-3 hover:bg-[--blue-light]/10">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-[--black-soft] text-sm">Recordatorio de cita</span>
                            <span className="text-xs text-[--gray-medium]">Ayer</span>
                          </div>
                          <p className="text-xs text-[--gray-medium]">Tiene una consulta de seguimiento programada para mañana a las 10:00 AM.</p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer flex justify-center text-[--blue-main] text-sm hover:bg-[--blue-light]/10">
                      Ver todas las notificaciones
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-[--blue-light]/20 p-2 rounded-lg transition-colors">
                      <div className="h-8 w-8 rounded-full bg-[--blue-main] flex items-center justify-center text-white font-medium shadow-sm">
                        J
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[--black-soft]">José Ponce A</span>
                        <span className="text-xs text-[--gray-medium]">Paciente</span>
                      </div>
                      <svg className="h-4 w-4 text-[--gray-medium]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-1 shadow-lg">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-[--black-soft]">{patientData.name} {patientData.lastName}</p>
                      <p className="text-xs text-[--gray-medium] mt-1">{patientData.email}</p>
                    </div>
                    <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-[--blue-light]/10" onClick={() => setShowEditProfileDialog(true)}>
                      <svg className="mr-2 h-4 w-4 text-[--gray-medium]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      <span className="text-sm">Editar perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer px-4 py-2 text-[--red-alert] hover:bg-red-50" onClick={() => setShowConfirmLogoutDialog(true)}>
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span className="text-sm">Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Datos del paciente */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[--blue-main] mb-4">Datos del paciente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className="w-14 h-14 flex-shrink-0 rounded-full bg-[--blue-main] flex items-center justify-center text-xl font-bold text-white shadow-sm">
                      {patientData.name.charAt(0)}{patientData.lastName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-[--black-soft]">{patientData.name} {patientData.lastName}</h3>
                      <p className="text-sm text-[--gray-medium]">{patientData.age} años</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <h3 className="text-sm font-medium text-[--blue-main] mb-2">Información de Contacto</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <svg className="mr-2 h-4 w-4 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span className="text-[--black-soft]">{patientData.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="mr-2 h-4 w-4 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span className="text-[--black-soft]">{patientData.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="mr-2 h-4 w-4 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span className="text-[--black-soft]">{patientData.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <h3 className="text-sm font-medium text-[--blue-main] mb-2">Datos Basales</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <svg className="mr-2 h-4 w-4 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 20h20"></path>
                        <path d="M6 16V4"></path>
                        <path d="M10 16V10"></path>
                        <path d="M14 16v-6"></path>
                        <path d="M18 16V8"></path>
                      </svg>
                      <span className="text-[--black-soft]">Peso: {patientData.weight} kg</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="mr-2 h-4 w-4 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                      </svg>
                      <span className="text-[--black-soft]">Estatura: {patientData.height} cm</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="mr-2 h-4 w-4 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 10h-4V4h-4v6H6l6 6 6-6z"></path>
                        <path d="M6 16v4h12v-4"></path>
                      </svg>
                      <span className="text-[--black-soft]">Fumador: {patientData.isSmoker ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <svg className="mr-2 h-4 w-4 text-[--blue-main]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <span className="text-[--black-soft]">Seguro: {patientData.insurance}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button 
                className="bg-[--blue-main] hover:bg-[--blue-main]/90 text-white border-none shadow-sm"
                onClick={() => setShowEditProfileDialog(true)}
              >
                Editar perfil
              </Button>
              <Button className="bg-white hover:bg-[--blue-light] text-[--blue-main] border border-[--blue-main]/30 shadow-sm">Formulario</Button>
            </div>
          </div>
          
          {/* Dashboard de salud */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[--blue-main] mb-4">Resumen de Salud</h2>
            <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-5">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Indicador de glucosa */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-[--yellow-warning]">
                      <span className="text-lg font-bold text-[--black-soft]">145</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-[--black-soft]">Glucosa</h3>
                      <p className="text-sm text-[--gray-medium]">Promedio: 145 mg/dL</p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[--yellow-warning]"></div>
                        <span className="text-xs text-[--yellow-warning] font-medium">Elevada</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicador de presión arterial */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 border-[--green-success]">
                      <span className="text-sm font-bold text-[--black-soft]">125/82</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-[--black-soft]">Presión arterial</h3>
                      <p className="text-sm text-[--gray-medium]">Promedio: 125/82 mmHg</p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[--green-success]"></div>
                        <span className="text-xs text-[--green-success] font-medium">Normal</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicador de IMC */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-[--red-alert]">
                      <span className="text-lg font-bold text-[--black-soft]">31.2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-[--black-soft]">IMC</h3>
                      <p className="text-sm text-[--gray-medium]">Peso: 95 kg, Altura: 175 cm</p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[--red-alert]"></div>
                        <span className="text-xs text-[--red-alert] font-medium">Obesidad</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos de seguimiento */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[--blue-main] mb-4">Gráficos semanales</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <h3 className="text-sm font-medium text-[--blue-main] mb-4">Gráfico Semanal de Glucemia</h3>
                  
                  {/* Gráfico de glucosa con barras interactivas */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={glucoseData}
                        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 10, fill: 'var(--gray-medium)' }}
                          tickLine={false}
                          axisLine={{ stroke: '#e5e5e5' }}
                        />
                        <YAxis 
                          hide={false}
                          tick={{ fontSize: 10, fill: 'var(--gray-medium)' }}
                          tickLine={false}
                          axisLine={{ stroke: '#e5e5e5' }}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          formatter={(value: number) => [`${value} mg/dL`, 'Glucosa']}
                          labelFormatter={(label) => `${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e5e5',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        />
                        <ReferenceLine y={140} stroke="var(--yellow-warning)" strokeDasharray="3 3" />
                        <ReferenceLine y={180} stroke="var(--red-alert)" strokeDasharray="3 3" />
                        <ReferenceLine y={70} stroke="var(--blue-main)" strokeDasharray="3 3" />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {
                            glucoseData.map((entry, index) => {
                              let color = 'var(--green-success)';
                              if (entry.value < 70) color = 'var(--blue-main)';
                              else if (entry.value > 180) color = 'var(--red-alert)';
                              else if (entry.value > 140) color = 'var(--yellow-warning)';
                              
                              return <Cell key={`cell-${index}`} fill={color} />;
                            })
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <h3 className="text-sm font-medium text-[--blue-main] mb-4">Gráfico semanal de Presión sanguínea</h3>
                  
                  {/* Gráfico de presión arterial interactivo */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={bloodPressureData}
                        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 10, fill: 'var(--gray-medium)' }}
                          tickLine={false}
                          axisLine={{ stroke: '#e5e5e5' }}
                        />
                        <YAxis 
                          hide={false}
                          tick={{ fontSize: 10, fill: 'var(--gray-medium)' }}
                          tickLine={false}
                          axisLine={{ stroke: '#e5e5e5' }}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => {
                            return [`${value} mmHg`, name === 'systolic' ? 'Sistólica' : 'Diastólica'];
                          }}
                          labelFormatter={(label) => `${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e5e5',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        />
                        <ReferenceLine y={140} stroke="var(--yellow-warning)" strokeDasharray="3 3" />
                        <ReferenceLine y={90} stroke="var(--blue-main)" strokeDasharray="3 3" />
                        
                        <Line 
                          type="monotone" 
                          dataKey="systolic" 
                          name="Sistólica"
                          stroke="var(--red-alert)" 
                          strokeWidth={2}
                          dot={{ r: 4, stroke: 'var(--red-alert)', fill: 'white' }}
                          activeDot={{ r: 5, stroke: 'var(--red-alert)', fill: 'white' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="diastolic" 
                          name="Diastólica"
                          stroke="var(--blue-main)" 
                          strokeWidth={2}
                          dot={{ r: 4, stroke: 'var(--blue-main)', fill: 'white' }}
                          activeDot={{ r: 5, stroke: 'var(--blue-main)', fill: 'white' }}
                        />
                        
                        <Legend 
                          verticalAlign="top" 
                          align="right"
                          wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} 
                          formatter={(value) => value === 'systolic' ? 'Sistólica' : 'Diastólica'} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Metas y tendencias */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[--blue-main] mb-4">Metas y Tendencias</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {/* Gráfico de tendencia de glucosa */}
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-[--black-soft]">Glucosa</h3>
                    <div className="flex items-center">
                      <svg 
                        className="h-5 w-5 text-[--green-success]" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6-6 6 6"/>
                        <path d="M6 12h12"/>
                        <path d="m6 15 6 6 6-6"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Gráfico de tendencia interactivo */}
                  <div className="h-24 w-full bg-white rounded mb-3 border border-[--blue-light]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={glucoseData}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 9, fill: 'var(--gray-medium)' }}
                          tickLine={false}
                          axisLine={{ stroke: '#e5e5e5' }}
                        />
                        <Tooltip
                          formatter={(value: number) => [`${value} mg/dL`, 'Glucosa']}
                          labelFormatter={(label) => `${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e5e5',
                            borderRadius: '4px',
                            fontSize: '10px'
                          }}
                        />
                        <ReferenceLine y={140} stroke="var(--yellow-warning)" strokeDasharray="3 3" />
                        <ReferenceLine y={70} stroke="var(--blue-main)" strokeDasharray="3 3" />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="var(--blue-main)" 
                          fill="var(--blue-light)" 
                          fillOpacity={0.4}
                          activeDot={{ r: 4, stroke: 'var(--blue-main)', strokeWidth: 1, fill: 'white' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[--gray-medium]">Meta: 120 mg/dL</p>
                      <div className="mt-1">
                        <Progress value={65} className="h-2 w-36" />
                      </div>
                    </div>
                    <Badge className="bg-[--yellow-warning] text-white">+25 mg/dL</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de tendencia de presión arterial */}
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-[--black-soft]">Presión Arterial</h3>
                    <div className="flex items-center">
                      <svg 
                        className="h-5 w-5 text-[--red-alert]" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="m18 15-6-6-6 6"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Gráfico de tendencia interactivo */}
                  <div className="h-24 w-full bg-white rounded mb-3 border border-[--blue-light]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={bloodPressureData}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 9, fill: 'var(--gray-medium)' }}
                          tickLine={false}
                          axisLine={{ stroke: '#e5e5e5' }}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => {
                            return [`${value} mmHg`, name === 'systolic' ? 'Sistólica' : 'Diastólica'];
                          }}
                          labelFormatter={(label) => `${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e5e5',
                            borderRadius: '4px',
                            fontSize: '10px'
                          }}
                        />
                        <ReferenceLine y={140} stroke="var(--yellow-warning)" strokeDasharray="3 3" />
                        <ReferenceLine y={90} stroke="var(--blue-main)" strokeDasharray="3 3" />
                        
                        <Line 
                          type="monotone" 
                          dataKey="systolic" 
                          name="Sistólica"
                          stroke="var(--red-alert)" 
                          strokeWidth={2}
                          dot={{ r: 3, stroke: 'var(--red-alert)', fill: 'white' }}
                          activeDot={{ r: 4, stroke: 'var(--red-alert)', fill: 'white' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="diastolic" 
                          name="Diastólica"
                          stroke="var(--blue-main)" 
                          strokeWidth={2}
                          dot={{ r: 3, stroke: 'var(--blue-main)', fill: 'white' }}
                          activeDot={{ r: 4, stroke: 'var(--blue-main)', fill: 'white' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[--gray-medium]">Meta: 120/80 mmHg</p>
                      <div className="mt-1">
                        <Progress value={40} className="h-2 w-36" />
                      </div>
                    </div>
                    <Badge className="bg-[--red-alert] text-white">+10 mmHg</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de tendencia de peso */}
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-[--black-soft]">Peso</h3>
                    <div className="flex items-center">
                      <svg 
                        className="h-5 w-5 text-[--green-success]" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6-6 6 6"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Mini gráfico de tendencia */}
                  <div className="h-12 w-full bg-white rounded mb-3 p-2 border border-[--blue-light]">
                    <div className="flex items-end justify-between h-full space-x-1">
                      <div className="w-1/7 h-[70%] bg-[--green-success] rounded-t"></div>
                      <div className="w-1/7 h-[65%] bg-[--green-success] rounded-t"></div>
                      <div className="w-1/7 h-[60%] bg-[--green-success] rounded-t"></div>
                      <div className="w-1/7 h-[55%] bg-[--green-success] rounded-t"></div>
                      <div className="w-1/7 h-[50%] bg-[--green-success] rounded-t"></div>
                      <div className="w-1/7 h-[45%] bg-[--green-success] rounded-t"></div>
                      <div className="w-1/7 h-[40%] bg-[--green-success] rounded-t"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[--gray-medium]">Meta: 80 kg</p>
                      <div className="mt-1">
                        <Progress value={20} className="h-2 w-36" />
                      </div>
                    </div>
                    <Badge className="bg-[--green-success] text-white">-2.5 kg</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Panel de factores de riesgo */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[--blue-main] mb-4">Factores de Riesgo Cardiovascular</h2>
            
            <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-[--red-alert] flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold text-[--red-alert]">Alto</span>
                    </div>
                    <h3 className="text-sm font-medium text-[--black-soft]">Nivel de riesgo</h3>
                    <p className="mt-2 text-xs text-center text-[--gray-medium]">
                      Basado en los factores de riesgo actuales, su probabilidad de un evento cardiovascular en los próximos 10 años es elevada.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-[--black-soft]">Factores contribuyentes</h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-[--red-alert] rounded-full flex items-center justify-center text-white text-xs">!</div>
                        <p className="ml-2 text-xs text-[--gray-medium]">Diabetes tipo 2 no controlada adecuadamente</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-[--red-alert] rounded-full flex items-center justify-center text-white text-xs">!</div>
                        <p className="ml-2 text-xs text-[--gray-medium]">Hipertensión arterial (135/85 mmHg)</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-[--red-alert] rounded-full flex items-center justify-center text-white text-xs">!</div>
                        <p className="ml-2 text-xs text-[--gray-medium]">Obesidad (IMC 31.1)</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-[--yellow-warning] rounded-full flex items-center justify-center text-white text-xs">!</div>
                        <p className="ml-2 text-xs text-[--gray-medium]">Edad (56 años)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-[--black-soft] mb-4">Recomendaciones</h3>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-[--green-success] rounded-full flex items-center justify-center text-white text-xs">✓</div>
                        <p className="ml-2 text-xs text-[--gray-medium]">Mejorar control glucémico (meta: 70-130 mg/dL antes de comidas)</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-[--green-success] rounded-full flex items-center justify-center text-white text-xs">✓</div>
                        <p className="ml-2 text-xs text-[--gray-medium]">Reducir peso corporal (meta inicial: 5% en 6 meses)</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-[--green-success] rounded-full flex items-center justify-center text-white text-xs">✓</div>
                        <p className="ml-2 text-xs text-[--gray-medium]">Mantener presión arterial por debajo de 130/80 mmHg</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-[--green-success] rounded-full flex items-center justify-center text-white text-xs">✓</div>
                        <p className="ml-2 text-xs text-[--gray-medium]">Realizar actividad física moderada por 30 minutos, 5 veces por semana</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sección de Medicación Activa - OCULTA */}
          
          {/* Sección de Calendario de Atención y Prescripciones - OCULTA */}
          
          {/* Sección de Educación y Recursos - OCULTA */}
          
          {/* Sección de Actividad Física - OCULTA */}
          
          {/* Sección de Alimentación e Impacto en Glucosa - OCULTA */}
          
        </div>
      </div>

      {/* Diálogos de edición y configuración */}
      {/* Diálogo para editar perfil */}
      <Dialog open={showEditProfileDialog} onOpenChange={setShowEditProfileDialog}>
        <DialogContent className="max-w-[90vw] sm:max-w-[500px] border border-[--blue-light] shadow-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-[--blue-main] text-xl">Editar Perfil</DialogTitle>
            <DialogDescription className="text-[--gray-medium]">
              Actualiza tus datos personales y de contacto.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[--black-soft]">Nombre</Label>
                <Input 
                  id="name" 
                  value={patientData.name} 
                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  className="border-[--blue-light] focus-visible:ring-[--blue-main]" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-[--black-soft]">Apellido</Label>
                <Input 
                  id="lastname" 
                  value={patientData.lastName} 
                  onChange={(e) => setPatientData({...patientData, lastName: e.target.value})}
                  className="border-[--blue-light] focus-visible:ring-[--blue-main]" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age" className="text-[--black-soft]">Edad</Label>
              <Input 
                id="age" 
                type="number" 
                value={patientData.age} 
                onChange={(e) => setPatientData({...patientData, age: parseInt(e.target.value) || 0})}
                className="border-[--blue-light] focus-visible:ring-[--blue-main]" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[--black-soft]">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                value={patientData.email} 
                onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                className="border-[--blue-light] focus-visible:ring-[--blue-main]" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[--black-soft]">Teléfono</Label>
              <Input 
                id="phone" 
                value={patientData.phone}
                onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                className="border-[--blue-light] focus-visible:ring-[--blue-main]" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[--black-soft]">Dirección</Label>
              <Input 
                id="address" 
                value={patientData.address}
                onChange={(e) => setPatientData({...patientData, address: e.target.value})}
                className="border-[--blue-light] focus-visible:ring-[--blue-main]" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-[--black-soft]">Peso (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  value={patientData.weight}
                  onChange={(e) => setPatientData({...patientData, weight: parseInt(e.target.value) || 0})}
                  className="border-[--blue-light] focus-visible:ring-[--blue-main]" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-[--black-soft]">Estatura (cm)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  value={patientData.height}
                  onChange={(e) => setPatientData({...patientData, height: parseInt(e.target.value) || 0})}
                  className="border-[--blue-light] focus-visible:ring-[--blue-main]" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insurance" className="text-[--black-soft]">Seguro Médico</Label>
              <Input 
                id="insurance" 
                value={patientData.insurance}
                onChange={(e) => setPatientData({...patientData, insurance: e.target.value})}
                className="border-[--blue-light] focus-visible:ring-[--blue-main]" 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="smoker" 
                checked={patientData.isSmoker}
                onCheckedChange={(checked) => setPatientData({...patientData, isSmoker: checked})}
              />
              <Label htmlFor="smoker" className="text-[--black-soft]">Fumador</Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditProfileDialog(false)} 
              className="border-[--blue-main]/30 text-[--blue-main] hover:bg-[--blue-light]/20"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveProfile}
              className="bg-[--blue-main] hover:bg-[--blue-main]/90 text-white"
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar cierre de sesión */}
      <Dialog open={showConfirmLogoutDialog} onOpenChange={setShowConfirmLogoutDialog}>
        <DialogContent className="sm:max-w-[425px] border border-[--red-alert]/20 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-[--red-alert] text-xl">Confirmar cierre de sesión</DialogTitle>
            <DialogDescription className="text-[--gray-medium]">
              ¿Estás seguro de que deseas cerrar la sesión?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirmLogoutDialog(false)} className="border-[--gray-medium]/30 text-[--gray-medium] hover:bg-[--gray-light]">
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                // Aquí iría la lógica para cerrar sesión, por ahora solo vamos a la página de login
                window.location.href = "/auth";
              }}
              className="bg-[--red-alert] hover:bg-[--red-alert]/90 text-white"
            >
              Cerrar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}