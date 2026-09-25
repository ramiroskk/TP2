// @ts-ignore Node.js built-in module types are not installed in this project.
import * as readline from 'node:readline/promises';
// @ts-ignore Node.js built-in module types are not installed in this project.
import { stdin as input, stdout as output } from 'node:process';
import {
    agregarTarea, 
    buscarPorId, 
    obtenerTareasPorEstado, 
    modificarTarea 
} from './tareas.js';
import type { Tarea } from './tareas.js';

const rl = readline.createInterface({ input, output });

async function pedirTexto(pregunta: string): Promise<string> {
    const respuesta = await rl.question(pregunta);
    return respuesta.trim();
}

async function pedirNumero(pregunta: string): Promise<number> {
    const respuesta = await rl.question(pregunta);
    const num = parseInt(respuesta.trim(), 10);
    return isNaN(num) ? -1 : num;
}

async function pedirEstadoValido(pregunta: string): Promise<string> {
    while (true) {
        const respuesta = (await pedirTexto(pregunta)).toUpperCase();
        if (respuesta === 'P' || respuesta === 'E' || respuesta === 'T' || respuesta === 'C') {
            return respuesta;
        }
        console.log('\nacaso eres tonto no ves que solo puedes poner esas opcions\n');
    }
}

async function pedirDificultadValida(pregunta: string): Promise<number> {
    while (true) {
        const num = await pedirNumero(pregunta);
        if (num === 1 || num === 2 || num === 3) {
            return num;
        }
        console.log('\nun mono es mas inteligente que tu, sin ofender bro\n');
    }
}

function mostrarTarea(t: Tarea): void {
    console.log(`ID: ${t.id} | Nombre: ${t.nombre} | Estado: [${t.estado}] | Dificultad: ${t.dificultad}`);
    console.log(`Descripción: ${t.descripcion}`);
    console.log('andamos cargando bro, no te desesperes\n');
}

async function menuVerTareas(): Promise<void> {
    let subopcion = -1;

    while (subopcion !== 0) {
        console.log('\nMIS TAREAS\n');
        console.log(' [1] Todas');
        console.log(' [2] Pendientes');
        console.log(' [3] En curso');
        console.log(' [4] Terminadas');
        console.log(' [5] Canceladas');
        console.log(' [0] Volver.\n');

        subopcion = await pedirNumero('> ');

        if (subopcion >= 1 && subopcion <= 5) {
            await pedirNumero('\n¿Cómo querés el orden de las tareas?\n [1] Por orden de creación\n> ');

            const tareas = obtenerTareasPorEstado(subopcion);
            console.log('\nLISTA DE TAREAS');

            if (tareas.length === 0) {
                console.log('No se encontró ninguna tarea.');
            } else {
                for (let i = 0; i < tareas.length; i++) {
                    const tarea = tareas[i];
                    if (tarea) {
                        mostrarTarea(tarea);
                    }
                }

                const idEditar = await pedirNumero('\n¿Querés editar una tarea? Ingresá su ID (o 0 para volver): ');
                if (idEditar > 0) {
                    const tarea = buscarPorId(idEditar);
                    if (tarea) {
                        console.log(`\n[Modificando Tarea ID ${idEditar}]`);
                        const nuevoNombre = await pedirTexto('Nuevo nombre: ');
                        const nuevaDesc = await pedirTexto('Nueva descripción: ');
                        const nuevoEstado = await pedirEstadoValido('Nuevo estado ([P]/[E]/[T]/[C]): ');
                        const nuevaDif = await pedirDificultadValida('Nueva dificultad ([1]/[2]/[3]): ');

                        modificarTarea(idEditar, nuevoNombre, nuevaDesc, nuevoEstado, nuevaDif);
                        console.log('\nTarea editada con éxito.\n');
                    } else {
                        console.log('\nNo se encontró ninguna tarea con ese ID.\n');
                    }
                }
            }
        }
    }
}

async function menuBuscarTarea(): Promise<void> {
    let subopcion = -1;

    while (subopcion !== 0) {
        console.log('\nBUSCAR TAREAS\n');
        const id = await pedirNumero('Insertá el ID de la tarea a buscar (o 0 para volver): ');

        if (id === 0) {
            break;
        }

        const tarea = buscarPorId(id);
        if (tarea) {
            console.log('\nTarea Encontrada:');
            mostrarTarea(tarea);
        } else {
            console.log('\nNo se encontró ninguna tarea con ese ID.');
        }

        subopcion = await pedirNumero('\nPresioná 0 para volver o cualquier número para seguir buscando: ');
    }
}

async function menuAgregarTarea(): Promise<void> {
    console.log('\nAÑADIR TAREA\n');
    const nombre = await pedirTexto('Nombre: ');
    const desc = await pedirTexto('Descripción: ');
    const estado = await pedirEstadoValido('Estado ([P]endiente / [E]n curso / [T]erminada / [C]ancelada): ');
    const dif = await pedirDificultadValida('Dificultad ([1] / [2] / [3]): ');

    agregarTarea(nombre, desc, estado, dif);
    console.log('\nTarea creada con éxito.\n');
}

async function main(): Promise<void> {
    let opcion = -1;

    while (opcion !== 0) {
        console.log('bienvenido papu :v que deseas hacer?\n');
        console.log(' [1] Ver Mis Tareas');
        console.log(' [2] Buscar una Tarea');
        console.log(' [3] Agregar una Tarea');
        console.log(' [0] Salir.\n');

        opcion = await pedirNumero('> ');

        switch (opcion) {
            case 1:
                await menuVerTareas();
                break;
            case 2:
                await menuBuscarTarea();
                break;
            case 3:
                await menuAgregarTarea();
                break;
            case 0:
                console.log('\nNos vemos.');
                break;
            default:
                console.log('\nOpción inválida.\n');
        }
    }

    rl.close();
}

main();