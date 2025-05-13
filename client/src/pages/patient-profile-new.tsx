import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="sm:w-1/4 flex flex-col items-center justify-center">
                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-[--blue-main] flex items-center justify-center text-white text-4xl font-semibold shadow-sm">
                      {patientData.name[0]}{patientData.lastName[0]}
                    </div>
                    <h3 className="font-medium text-[--black-soft]">{patientData.name} {patientData.lastName}</h3>
                    <p className="text-sm text-[--gray-medium]">{patientData.age} años</p>
                  </div>
                  
                  <div className="sm:w-3/4 space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[--blue-main] mb-2">Información de Contacto</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-[--gray-medium]">Teléfono</p>
                          <p className="text-sm font-medium text-[--black-soft]">{patientData.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[--gray-medium]">Email</p>
                          <p className="text-sm font-medium text-[--black-soft]">{patientData.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[--gray-medium]">Dirección</p>
                          <p className="text-sm font-medium text-[--black-soft]">{patientData.address}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-[--blue-main] mb-2">Datos Basales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-[--gray-medium]">Peso</p>
                          <p className="text-sm font-medium text-[--black-soft]">{patientData.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-[--gray-medium]">Altura</p>
                          <p className="text-sm font-medium text-[--black-soft]">{patientData.height} cm</p>
                        </div>
                        <div>
                          <p className="text-xs text-[--gray-medium]">IMC</p>
                          <p className="text-sm font-medium text-[--black-soft]">{(patientData.weight / ((patientData.height/100) * (patientData.height/100))).toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[--gray-medium]">Fumador</p>
                          <p className="text-sm font-medium text-[--black-soft]">{patientData.isSmoker ? "Sí" : "No"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Dashboard de salud */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[--blue-main] mb-4">Resumen de Salud</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 flex flex-col items-center">
                  <svg className="h-12 w-12 mb-2 text-[--red-alert]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1.5h12V8Z"></path>
                    <path d="M6 9.5V20a1 1 0 0 0 1 1h2V14a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7h2a1 1 0 0 0 1-1V9.5"></path>
                    <path d="M9 21v-7h6v7"></path>
                  </svg>
                  <h3 className="font-medium text-[--black-soft]">Glucosa</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-[--red-alert]">164</span>
                    <span className="ml-1 text-xs text-[--gray-medium]">mg/dL</span>
                  </div>
                  <p className="mt-1 text-xs text-[--gray-medium]">Última medición: Hoy 09:34 AM</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 flex flex-col items-center">
                  <svg className="h-12 w-12 mb-2 text-[--yellow-warning]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <h3 className="font-medium text-[--black-soft]">Presión arterial</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-[--yellow-warning]">135/85</span>
                    <span className="ml-1 text-xs text-[--gray-medium]">mmHg</span>
                  </div>
                  <p className="mt-1 text-xs text-[--gray-medium]">Última medición: Hoy 09:36 AM</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 flex flex-col items-center">
                  <svg className="h-12 w-12 mb-2 text-[--red-alert]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <path d="M2 10h20"></path>
                  </svg>
                  <h3 className="font-medium text-[--black-soft]">IMC</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-[--red-alert]">31.1</span>
                    <span className="ml-1 text-xs text-[--gray-medium]">kg/m²</span>
                  </div>
                  <p className="mt-1 text-xs text-[--gray-medium]">Última actualización: 10 mayo 2023</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Gráficos de seguimiento */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[--blue-main] mb-4">Gráficos semanales</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <h3 className="text-sm font-medium text-[--blue-main] mb-4">Gráfico Semanal de Glucemia</h3>
                  
                  {/* Simulación de gráfico con barras */}
                  <div className="h-48 flex items-end justify-between">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--red-alert] rounded-t" style={{height: '70%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Lun</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--yellow-warning] rounded-t" style={{height: '55%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Mar</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--green-success] rounded-t" style={{height: '40%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Mié</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--green-success] rounded-t" style={{height: '35%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Jue</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--yellow-warning] rounded-t" style={{height: '50%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Vie</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--yellow-warning] rounded-t" style={{height: '60%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Sáb</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--red-alert] rounded-t" style={{height: '80%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Dom</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <h3 className="text-sm font-medium text-[--blue-main] mb-4">Gráfico semanal de Presión sanguínea</h3>
                  
                  {/* Simulación de gráfico con barras */}
                  <div className="h-48 flex items-end justify-between">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--yellow-warning] rounded-t" style={{height: '60%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Lun</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--yellow-warning] rounded-t" style={{height: '65%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Mar</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--yellow-warning] rounded-t" style={{height: '55%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Mié</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--green-success] rounded-t" style={{height: '45%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Jue</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--green-success] rounded-t" style={{height: '40%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Vie</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--yellow-warning] rounded-t" style={{height: '50%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Sáb</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-[--yellow-warning] rounded-t" style={{height: '60%'}}></div>
                      <span className="text-xs text-[--gray-medium]">Dom</span>
                    </div>
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
    </div>
  );
}