import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Usuarios } from '../../Services/usuarios';
import { IUsuarioOut, IUsuarioUpdatePayload, UsuarioUpdateResponse } from '../../Interfaces/IUsuario';

// ✅ Tipos para password
export interface PasswordUpdatePayload {
  current_password: string;
  new_password: string;
}
export interface PasswordUpdateResponse {
  msg: string;
}

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mis-datos.html',
  styleUrl: './mis-datos.css',
})
export class MisDatos implements OnInit {
  private usuariosService = inject(Usuarios);
  private router = inject(Router);

  loadingDatos = false;
  loadingPass = false;

  userId = Number(localStorage.getItem('user_id')) || 0;

  // ---- FORM DATOS ----
  form = new FormGroup({
    nombre: new FormControl<string | null>('', [Validators.required]),
    apellido: new FormControl<string | null>('', [Validators.required]),
    dni: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    telefono: new FormControl<string | null>(''),
    edad: new FormControl<number | null>(null, [Validators.min(0)]),
    alergias: new FormControl<string | null>(''),
    rol: new FormControl({ value: '', disabled: true }),
  });

  // ---- FORM PASSWORD ----
  passForm = new FormGroup({
    current_password: new FormControl<string | null>('', [Validators.required]),
    new_password: new FormControl<string | null>('', [Validators.required, Validators.minLength(6)]),
    repeat_password: new FormControl<string | null>('', [Validators.required]),
  });

  async ngOnInit() {
    if (!this.userId) {
      this.router.navigateByUrl('/login');
      return;
    }
    await this.cargarMisDatos();
  }

  async cargarMisDatos() {
    this.loadingDatos = true;
    try {
      const user: IUsuarioOut = await this.usuariosService.getUserById(this.userId);

      this.form.patchValue({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        edad: user.edad ?? null,
        alergias: user.alergias || '',
      });

      // disabled fields -> setValue directo
      this.form.get('dni')?.setValue(user.dni || '');
      this.form.get('email')?.setValue(user.email || '');
      this.form.get('rol')?.setValue(user.rol || '');

    } catch (e) {
      Swal.fire('Error', 'No se pudieron cargar tus datos.', 'error');
    } finally {
      this.loadingDatos = false;
    }
  }

  async guardarDatos() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingDatos = true;
    try {
      // ✅ normalizamos null -> undefined (para que encaje con la interfaz)
      const payload: IUsuarioUpdatePayload = {
        nombre: this.form.value.nombre ?? undefined,
        apellido: this.form.value.apellido ?? undefined,
        telefono: this.form.value.telefono ?? undefined,
        edad: this.form.value.edad ?? undefined,
        alergias: this.form.value.alergias ?? undefined,
      };

      const res: UsuarioUpdateResponse = await this.usuariosService.updateUser(this.userId, payload);

      // refresca localStorage para el saludo
      if (res?.user?.nombre) localStorage.setItem('user_name', res.user.nombre);
      if (res?.user?.apellido) localStorage.setItem('user_apellido', res.user.apellido);

      Swal.fire('Guardado', 'Tus datos se actualizaron correctamente.', 'success');
    } catch (e: any) {
      Swal.fire('Error', e?.error?.detail || 'No se pudieron guardar los cambios.', 'error');
    } finally {
      this.loadingDatos = false;
    }
  }

  async cambiarPassword() {
    if (this.passForm.invalid) {
      this.passForm.markAllAsTouched();
      return;
    }

    const current = this.passForm.value.current_password?.trim() || '';
    const next = this.passForm.value.new_password?.trim() || '';
    const repeat = this.passForm.value.repeat_password?.trim() || '';

    if (next !== repeat) {
      Swal.fire('Atención', 'La nueva contraseña no coincide.', 'warning');
      return;
    }

    if (next.length < 6) {
      Swal.fire('Atención', 'La nueva contraseña debe tener al menos 6 caracteres.', 'warning');
      return;
    }

    this.loadingPass = true;
    try {
      const payload: PasswordUpdatePayload = {
        current_password: current,
        new_password: next,
      };

      // ✅ tu service debe tener changePassword()
      const res: PasswordUpdateResponse = await this.usuariosService.changePassword(this.userId, payload);

      Swal.fire('Listo', res.msg || 'Contraseña actualizada correctamente.', 'success');
      this.passForm.reset();

    } catch (e: any) {
      Swal.fire('Error', e?.error?.detail || 'No se pudo cambiar la contraseña.', 'error');
    } finally {
      this.loadingPass = false;
    }
  }

  volver() {
    this.router.navigateByUrl('/perfil-usuario');
  }
}
