import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Platos as PlatosService } from '../Services/platos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-plato',
  standalone: true,
  imports: [ReactiveFormsModule],
  // Reutilizamos el HTML y CSS del componente de creación
  templateUrl: '../Pages/create-platos/create-platos.html',// comparte html porque es lo mismo pero cambia que usamos la funcion patchvalue para traer los datos y no tener que escrinir de nuevo tdo ///
  styleUrl: '../Pages/create-platos/create-platos.css'
})
export class EditPlato implements OnInit {
  // Inyecciones de dependencias
  platoService = inject(PlatosService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  // Variables de control
  platoId!: number;
  imagenUrlSubida: string = '';

  // Definición del Formulario (Igual al de creación)
  registroForm: FormGroup = new FormGroup({
    categoria: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.min(0)]),
    ingredientes: new FormControl('', [Validators.required]),
    alergenos: new FormControl('', [Validators.required]),
    info_nutricional: new FormControl('', [Validators.required]),
    imagen_url: new FormControl(''),
    activo: new FormControl(1)
  });

  async ngOnInit() {
    // 1. Obtenemos el ID que viene en la URL (:id)
    const idParam = this.route.snapshot.params['id'];
    this.platoId = parseInt(idParam);

    // 2. Cargamos los datos actuales para pre-rellenar el formulario
    await this.cargarDatosDelPlato();
  }

  async cargarDatosDelPlato() {
    try {
      // Obtenemos todos los platos y buscamos el que coincida con el ID
      const platos = await this.platoService.getAll();
      const platoEncontrado = platos.find((p: any) => p.id === this.platoId);

      if (platoEncontrado) {
        // Rellenamos el formulario con los datos existentes
        this.registroForm.patchValue(platoEncontrado);
        // Guardamos la URL de la imagen para la vista previa
        this.imagenUrlSubida = platoEncontrado.imagen_url;
      } else {
        Swal.fire('Error', 'No se ha encontrado el plato solicitado.', 'error');
        this.router.navigate(['/admin/platos']);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
    }
  }

  // Lógica para subir una nueva imagen a Cloudinary si se desea cambiar
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    Swal.showLoading();

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'Upgrade_food'); // Tu preset de Cloudinary
    data.append('cloud_name', 'dej3mecyv');      // Tu cloud name de Cloudinary

    try {
      const resp = await fetch(`https://api.cloudinary.com/v1_1/dej3mecyv/image/upload`, {
        method: 'POST',
        body: data
      });
      
      const result = await resp.json();
      this.imagenUrlSubida = result.secure_url;
      
      // Actualizamos el campo imagen_url en el formulario
      this.registroForm.patchValue({ imagen_url: this.imagenUrlSubida });

      // Forzamos la detección de cambios para que la preview se actualice
      this.cdr.detectChanges();
      
      Swal.fire({
        title: 'Imagen actualizada',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo subir la nueva imagen', 'error');
    }
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      Swal.fire('Atención', 'Por favor, rellena todos los campos.', 'warning');
      return;
    }

    try {
      // Llamamos a la función update_plato pasándole el ID y los nuevos datos
      await this.platoService.editarPlato(this.platoId, this.registroForm.value);
      
      await Swal.fire({
        title: '¡Actualizado!',
        text: 'El plato se ha modificado correctamente.',
        icon: 'success',
        confirmButtonColor: '#ffc107'
      });
      
      // Volvemos a la lista de gestión
      this.router.navigate(['/lista_platos']);
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error');
    }
  }
}