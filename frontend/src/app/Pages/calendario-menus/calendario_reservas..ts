import { Component, signal, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { ReservaService } from '../../Services/reserva-service';
import { IReserva } from '../../Interfaces/IReserva';

@Component({
  selector: 'app-calendario-menus',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendario_reservas.html',
  styleUrl: './calendario_reservas.css',
})
export class CalendarioMenus implements OnInit {
  private reservasService = inject(ReservaService);
  private router = inject(Router);

  // Señal para controlar si el usuario es administrador
  isAdmin = signal(false);

  // Configuración de FullCalendar
  calendarOptions = signal<any>({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es', 
    firstDay: 1,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    events: [],
    eventClick: (info: any) => {
      console.log('Detalle de reserva ID:', info.event.id);
    }
  });

  async ngOnInit() {
    // 1. Detectamos el rol
    const role = localStorage.getItem('user_role');
    const isUserAdmin = role === 'admin';
    this.isAdmin.set(isUserAdmin);

    try {
      // 2. Cargamos las reservas según el ROL
      let reservas: IReserva[];
      
      if (isUserAdmin) {
        reservas = await this.reservasService.getallReservas();
      } else {
        reservas = await this.reservasService.getMisReservas();
      }

      // 3. Mapeamos los datos al formato de FullCalendar
      const events = reservas.map((r: any) => {
        
        // --- LÓGICA DE CONVERSIÓN DE SEGUNDOS A HORA ---
        let horaFormateada = '00:00';
        
        if (r.hora) {
          // Si r.hora es "48600", lo pasamos a número y calculamos
          const segundosTotales = Number(r.hora);
          const h = Math.floor(segundosTotales / 3600);
          const m = Math.floor((segundosTotales % 3600) / 60);
          
          // Formateamos para que siempre tenga dos dígitos (09:05 en lugar de 9:5)
          const hh = h.toString().padStart(2, '0');
          const mm = m.toString().padStart(2, '0');
          horaFormateada = `${hh}:${mm}`;
        }

        return {
          id: r.id?.toString(),
          title: isUserAdmin 
            ? `${horaFormateada} | Mesa ${r.mesa_id} | ${r.party_size}p` 
            : `${horaFormateada} - Mi Reserva`, 
          start: r.fecha, 
          backgroundColor: r.estado === 'confirmada' ? '#28a745' : '#d4af37',
          borderColor: '#333',
          textColor: '#ffffff',
          display: 'block'
        };
      });

      // 4. Actualizamos el calendario
      this.calendarOptions.update(options => ({ 
        ...options, 
        events: events 
      }));

    } catch (error) {
      console.error("Error cargando las reservas en el calendario:", error);
    }
  }

  // Función para navegar hacia atrás según el rol
  volver() {
    if (this.isAdmin()) {
      this.router.navigate(['/admin/reservas']); 
    } else {
      this.router.navigate(['/perfil-usuario']);
    }
  }
}