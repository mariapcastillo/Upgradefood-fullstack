import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReservaService } from '../../Services/reserva-service';
import { IMesa } from '../../Interfaces/IMesa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class Reserva implements OnInit {
  // Inyecciones de dependencia
  private reservaService = inject(ReservaService);
  private router = inject(Router);
  message: string = '';
  success: boolean = false;
  // Variables de estado
  mesas: IMesa[] = [];
  mesasDisponibles: IMesa[] = [];
  loading = false;
  minDate = new Date().toISOString().split('T')[0];
  
  // Opciones para el select de horas
  horas: string[] = [
    '13:00', '13:30', '14:00', '14:30', 
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  // Definición del Formulario según tus columnas SQL
  reservaForm: FormGroup = new FormGroup({
    fecha: new FormControl('', [Validators.required]),
    hora: new FormControl('', [Validators.required]),
    mesa_id: new FormControl('', [Validators.required]),
    party_size: new FormControl(1, [Validators.required, Validators.min(1)]),
    resena: new FormControl('') // Usamos la columna resena como observaciones
  });

  // Al iniciar, traemos todas las mesas (sin mostrar)
  async ngOnInit() {
    try {
      this.mesas = await this.reservaService.getMesas();
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
      Swal.fire('Error', 'No se pudieron cargar las mesas disponibles', 'error');
    }
  }

  // Verifica si se pueden mostrar mesas y horas
  canShowMesasYHoras(): boolean {
    const fecha = this.reservaForm.get('fecha')?.value;
    const personas = this.reservaForm.get('party_size')?.value;
    return !!(fecha && personas && personas > 0);
  }

  // Se ejecuta cuando cambia fecha o cantidad de personas
  onFechaOrPersonasChange() {
    if (this.canShowMesasYHoras()) {
      this.filtrarMesasDisponibles();
      // Resetear mesa y hora seleccionadas
      this.reservaForm.get('mesa_id')?.setValue('');
      this.reservaForm.get('hora')?.setValue('');
    } else {
      this.mesasDisponibles = [];
    }
  }

  // Filtra las mesas según la capacidad: si 1 persona muestra mesas de 2, si no igualdad exacta
  private filtrarMesasDisponibles() {
    const personas = this.reservaForm.get('party_size')?.value;

  // Si el número es impar (personas % 2 !== 0), le sumamos 1. Si es par, se queda igual.
  const capacidadBuscada = personas % 2 !== 0 ? personas + 1 : personas;

  this.mesasDisponibles = this.mesas.filter(mesa => mesa.capacidad === capacidadBuscada);
  }

  // Helper para mostrar errores en el HTML
  showError(controlName: string): boolean {
    const control = this.reservaForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Envío del formulario
  async onSubmit() {
    console.log('SUBMIT DISPARADO', this.reservaForm.value);
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // Preparamos los datos convirtiendo IDs y tamaños a números
    const datosReserva = {
      ...this.reservaForm.value,
      mesa_id: Number(this.reservaForm.value.mesa_id),
      party_size: Number(this.reservaForm.value.party_size),
      estado: 'confirmada' // Estado por defecto según tu ENUM
    };

    try {
      // Llamada al backend de Python
      const response = await this.reservaService.createReserva(datosReserva);

      await Swal.fire({
        title: '¡Reserva Confirmada!',
        text: `${response.msg}. Tu código de reserva es el #${response.item.id}`,
        icon: 'success',
        confirmButtonColor: '#ffc107'
      });

      // Redirigimos a la home o a "mis reservas"
      this.router.navigateByUrl('/perfil-usuario');

    } catch (error: any) {
      console.error('Error en la reserva:', error);
      
      // Capturamos el error 400 del backend (Mesa ya ocupada)
      Swal.fire({
        title: 'No disponible',
        text: error.error?.detail || 'Hubo un problema al procesar tu reserva',
        icon: 'warning',
        confirmButtonColor: '#ffc107'
      });
    } finally {
      this.loading = false;
    }
  }

  // Método para resetear el formulario
  resetForm() {
    this.reservaForm.reset({
      party_size: 1,
      fecha: '',
      hora: '',
      mesa_id: '',
      resena: ''
    });
    this.mesasDisponibles = [];
  }
}