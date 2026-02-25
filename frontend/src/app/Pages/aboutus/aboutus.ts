import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ITeamMember {
  id: number;
  nombre: string;
  rol: string;
  descripcion: string;
  foto: string;
  tags: string[];
}

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.css',
})
export class Aboutus {

  team = signal<ITeamMember[]>([
    {
      id: 1,
      nombre: 'Laura Montironi',
      rol: 'Full Stack Developer',
      descripcion: `Soy desarrolladora Full Stack con una trayectoria que combina análisis estratégico y tecnología. Mi formación como Contadora Pública en Argentina me dio una base sólida en pensamiento estructurado, organización y resolución de problemas complejos.

Tras una pausa por maternidad decidí reinventarme profesionalmente y apostar por el desarrollo de software como evolución natural de mi perfil analítico. Volver a estudiar y salir de mi zona de confort fue un desafío que asumí con determinación.

Hoy construyo aplicaciones combinando lógica, claridad y enfoque práctico. Me apasiona crear soluciones funcionales, bien estructuradas y centradas en el usuario. Entiendo el desarrollo como un proceso continuo de mejora y aprendizaje.`,
      foto: 'https://github.com/laumontironi.png',
      tags: ['Full Stack', 'Backend & Tech Integration', 'Estrategia']
    },
    {
      id: 2,
      nombre: 'Micaela Besasso',
      rol: 'Full Stack Developer',
      descripcion: `Soy desarrolladora Full Stack argentina con base en Formentera. Migré sola a los 24 años, una experiencia que fortaleció mi capacidad de adaptación y mi autonomía profesional.

Mi formación previa en Arquitectura me permite entender el desarrollo como la construcción de estructuras digitales sólidas: cada proyecto necesita bases firmes y atención minuciosa al detalle.

Además, mi experiencia en hostelería me dio una gran empatía hacia el usuario final. Me gusta resolver problemas complejos con soluciones claras, eficientes y pensadas para las personas que las utilizan.`,
      foto: 'https://github.com/micaelabesa.png',
      tags: ['Arquitectura Digital', 'Resolución de Problemas', 'Autonomía']
    },
    {
      id: 3,
      nombre: 'María López',
      rol: 'Full Stack Developer',
      descripcion: `Soy fisioterapeuta y jugadora profesional de voleibol. La disciplina, la constancia y el trabajo en equipo han marcado mi trayectoria tanto deportiva como profesional.

Hace un año descubrí la programación y me fascinó desde el primer momento. La posibilidad de crear, resolver problemas y aprender constantemente encaja perfectamente con mi personalidad.

Actualmente me enfoco en el desarrollo Frontend, construyendo interfaces intuitivas y funcionales, siempre con mentalidad de superación y mejora continua.`,
      foto: 'assets/images/Maria-perfil.jpeg',
      tags: ['Frontend', 'Disciplina', 'Trabajo en Equipo']
    },
  ]);

}
