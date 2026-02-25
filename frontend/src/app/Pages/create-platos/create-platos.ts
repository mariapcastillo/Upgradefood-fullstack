import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Platos as PlatosService } from '../../Services/platos';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-plato',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-platos.html',
  styleUrl: './create-platos.css'
})
export class CreatePlato {
  platoService = inject(PlatosService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Variable para guardar la URL de la imagen que nos dé Cloudinary
  imagenUrlSubida: string = '';

  registroForm: FormGroup = new FormGroup({
    categoria: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.min(0)]),
    ingredientes: new FormControl('', [Validators.required]),
    alergenos: new FormControl('', [Validators.required]),
    info_nutricional: new FormControl('', [Validators.required]),
    imagen_url: new FormControl(''), // Se llenará tras subir a Cloudinary
    activo: new FormControl(1) // Por defecto activo
  });

  // FUNCIÓN PARA SUBIR A CLOUDINARY
async onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  console.log('Archivo seleccionado:', file.name); // Chivato 1

  Swal.fire({
    title: 'Subiendo a Cloudinary...',
    text: 'Por favor, espera',
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading(); }
  });

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'Upgrade_food');
  data.append('cloud_name', 'dej3mecyv');

  try {
    console.log('Iniciando Fetch...'); // Chivato 2
    
    // Añadimos un tiempo límite de 15 segundos para que no se quede colgado
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const resp = await fetch(`https://api.cloudinary.com/v1_1/dej3mecyv/image/upload`, {
      method: 'POST',
      body: data,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('Respuesta recibida:', resp.status); // Chivato 3

    const result = await resp.json();
    
    if (result.secure_url) {
      this.imagenUrlSubida = result.secure_url;
      console.log('URL obtenida:', this.imagenUrlSubida);
      
      this.registroForm.patchValue({ imagen_url: this.imagenUrlSubida });
      
      // Forzamos a Angular a que detecte el cambio y actualice la vista
      this.cdr.detectChanges();

      Swal.fire({ icon: 'success', title: '¡Imagen lista!', timer: 1000, showConfirmButton: false });
    } else {
      throw new Error(result.error?.message || 'Error desconocido');
    }

  } catch (error: any) {
    Swal.close();
    console.error('ERROR DETALLADO:', error);
    let mensaje = 'Error al subir';
    if (error.name === 'AbortError') mensaje = 'La subida ha tardado demasiado tiempo (Timeout)';
    Swal.fire('Error', mensaje, 'error');
  }
}

  async onSubmit() {
    if (this.registroForm.invalid) {
      Swal.fire('Atención', 'Por favor, rellena todos los campos correctamente.', 'warning');
      return;
    }

    try {
      // Aseguramos que los números sean números y no strings
      const platoToSend = {
        ...this.registroForm.value,
        precio: Number(this.registroForm.value.precio),
        activo: Number(this.registroForm.value.activo)
      };

      await this.platoService.createPlato(platoToSend);
      await Swal.fire({
        title: '¡Plato Creado!',
        text: 'El nuevo plato se ha añadido al Listado de platos.',
        icon: 'success',
        confirmButtonColor: '#ffc107'
      });
      this.router.navigate(['/lista_platos']); 
    } catch (error) {
      console.error('Error al crear el plato:', error); // IMPORTANTE: Para ver el error real
      Swal.fire('Error', 'Hubo un problema al guardar el plato.', 'error');
    }
  }
}