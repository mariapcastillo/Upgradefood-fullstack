import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; 
import { Usuarios } from '../../Services/usuarios';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

    usuarioService = inject(Usuarios);
    router= inject(Router);

  // signals
  inputTypePassword = signal<string>('password');
  inputTypeConfirmPassword = signal<string>('password');

  // FormGroup para manejar el formulario de registro:
  registroForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [
      Validators.required
    ]),
    apellido: new FormControl(null, [
      Validators.required
    ]),
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/),
    ]),
    dni: new FormControl(null, [
      Validators.required,
      this.dniValidator.bind(this), Validators.required
      ]),
    telefono: new FormControl('', [Validators.required]),
    // fechaNacimiento: new FormControl('dd-mm-aa', [
    //   Validators.required
    // ]),
    alergias: new FormControl(''),
    edad: new FormControl(null, [
      Validators.required,
      this.ageValidator.bind(this)
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ]),
  }, { // este validador para que sirva para todo el formulario se pasa como otro argumento
    validators: [this.passwordMatchValidator.bind(this)]
  });

  // funciones
  async onSubmit() {
  if (this.registroForm.valid) {
    try {
      // 1. Llamada al servicio con los datos del formulario
      const response = await this.usuarioService.registro(this.registroForm.value);
      console.log('Registro exitoso:', response);

      // 2. SweetAlert de éxito
      await Swal.fire({
        title: '¡Registro exitoso!',
        text: 'Usuario registrado correctamente.',
        icon: 'success',
        confirmButtonText: 'Ir al Login'
      });

      // 3. Redirección al login
      this.router.navigate(['/login']);

    } catch (error) {
      console.error('Error en el registro:', error);

      // 4. SweetAlert de fracaso
Swal.fire({
  title: 'Usuario ya registrado',
  text: 'Parece que ya tienes una cuenta con nosotros.',
  icon: 'info', // A veces el icono de info es menos "agresivo" que el de error
  showCancelButton: true,
  confirmButtonText: 'Ir al Login',
  cancelButtonText: 'Revisar datos',
  confirmButtonColor: '#ffc107',
}).then((result) => {
  if (result.isConfirmed) {
    this.router.navigate(['/login']);
  }
});
    }
  } else {
    // Opcional: marcar errores si el formulario no es válido al clicar
    this.registroForm.markAllAsTouched();
  }
}

  dniValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    //Si el campo está vacío, retornamos null (la validación de 'requerido' se hace aparte)
    if (!value) return null;
    const letras_posibles: string = 'TRWAGMYFPDXBNJZSQVHLCKET';
    
    // Convertir a mayúsculas para aceptar tanto mayúsculas como minúsculas .trim(): Elimina espacios al inicio/final
    const dniUpperCase: string = value.toUpperCase().trim();
    // el metodo test nos dice si la expresion regular se cumple o no, devuelve true:
    if (/^[XYZ\d]\d{7}[a-zA-Z]$/.test(dniUpperCase)) {
      let dni_para_calculo = dniUpperCase
      .replace('X', '0')
      .replace('Y', '1')
      .replace('Z', '2');
      const numero_extraido = dni_para_calculo.substring(0, 8);
      const resto = +(numero_extraido) % 23;
      const letra_correcta = letras_posibles[resto];
      const dni_letter = dniUpperCase.at(-1);
            
      if (dni_letter === letra_correcta) {
        return null;
      } else {
        return { letraIncorrecta: true };
      }
    } else {
      return { formatoInvalido: true };
    }
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    // con el metodo get extraigo el control completo de password ahora por ej
    const password = form.get('password')?.value;
    const repitePassword = form.get('confirmPassword')?.value;

    // Si coinciden, devolvemos null (todo ok)
    // Si no coinciden, devolvemos un objeto de error
    return password === repitePassword ? null : { passwordMismatch: true };
  }

  checkError(fieldName: string, errorName: string) {
    return this.registroForm.get(fieldName)?.hasError(errorName) && this.registroForm.get(fieldName)?.touched
  }

  // Verificar errores a nivel del FormGroup
  checkFormError(errorName: string) {
    return this.registroForm.hasError(errorName) && (this.registroForm.get('password')?.touched || this.registroForm.get('confirmPassword')?.touched)
  }

  ageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    // Si el campo está vacío, retornamos null (la validación de 'requerido' se hace aparte)
    if (!value) return null;

    if (value < 18) {
      return { menorDeEdad: true };
    }
    return null;
  }

  cambiarTipoInput(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.inputTypePassword.update(val => val === 'password' ? 'text' : 'password');
    } else {
      this.inputTypeConfirmPassword.update(val => val === 'password' ? 'text' : 'password');
    }
  }
}