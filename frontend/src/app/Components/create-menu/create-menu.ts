import { Component, inject, output, OnInit } from '@angular/core';
import { Menus } from '../../Services/menus';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-menu',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-menu.html',
  styleUrl: './create-menu.css',
})
export class CreateMenu implements OnInit {
  menuService = inject(Menus);
  router = inject(Router);
  menuCreado = output();

  form = new FormGroup({
    numero: new FormControl<number>(0, [Validators.required]),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl<number>(0, [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    activo: new FormControl(true),
    foto_url: new FormControl(''),
  });

  async ngOnInit() {
    await this.autocompletarNumero();
  }

  private async autocompletarNumero() {
    try {
      const menus: any[] = await this.menuService.getAll(); // <- NECESITAS ESTE MÉTODO EN EL SERVICE
      const maxNumero = menus.reduce((max, m) => Math.max(max, Number(m.numero) || 0), 0);
      this.form.patchValue({ numero: maxNumero + 1 });
    } catch (e) {
      // si falla, no rompemos nada: queda 0 y el usuario podría ponerlo manual
      console.warn('No se pudo autocompletar el número de menú:', e);
    }
  }

  async onSubmit() {
    if (!this.form.valid) return;

    try {
      const datosParaEnviar = {
        ...this.form.value,
        activo: this.form.value.activo ? 1 : 0,
      };

      const response = await this.menuService.createMenu(datosParaEnviar as any);

      const result = await Swal.fire({
        title: '¡Menú Creado!',
        text: '¿Qué quieres hacer ahora?',
        icon: 'success',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Asignar Platos',
        denyButtonText: 'Añadir otro menú',
        cancelButtonText: 'Ir al Dashboard',
        confirmButtonColor: '#ffc107',
        denyButtonColor: '#242424',
        cancelButtonColor: '#6c757d',
      });

      if (result.isConfirmed) {
        this.router.navigate(['/admin/asignar-platos', response.id]);
      } else if (result.isDenied) {
        this.form.reset({ activo: true, numero: 0, precio: 0 });
        await this.autocompletarNumero(); // ✅ vuelve a poner el siguiente número
      } else {
        this.router.navigate(['/admin']);
      }

    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error?.error?.detail || 'No se pudo guardar el menú. Nº de menú duplicado.',
        icon: 'error',
        confirmButtonColor: '#ffc107',
      });

      // ✅ si fue duplicado, recalculamos y lo intentas otra vez
      await this.autocompletarNumero();
    }
  }
}
