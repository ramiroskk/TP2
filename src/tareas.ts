export interface Tarea {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
    dificultad: number;
}

const listaTareas: Tarea[] = [];
let proximoId: number = 1;

export function agregarTarea(nombre: string, descripcion: string, estado: string, dificultad: number): void {
    const nueva: Tarea = {
        id: proximoId++,
        nombre,
        descripcion,
        estado,
        dificultad
    };
    listaTareas.push(nueva);
}

export function buscarPorId(id: number): Tarea | undefined {
    for (let i = 0; i < listaTareas.length; i++) {
        const tarea = listaTareas[i];
        if (tarea && tarea.id === id) {
            return tarea;
        }
    }
    return undefined;
}

export function obtenerTareasPorEstado(opcion: number): Tarea[] {
    if (opcion === 1) {
        return listaTareas;
    }

    const estados: Record<number, string> = { 2: 'P', 3: 'E', 4: 'T', 5: 'C' };
    const estadoBuscado = estados[opcion];

    const resultado: Tarea[] = [];
    for (let i = 0; i < listaTareas.length; i++) {
        const tarea = listaTareas[i];
        if (tarea && tarea.estado === estadoBuscado) {
            resultado.push(tarea);
        }
    }
    return resultado;
}

export function modificarTarea(id: number, nombre: string, desc: string, estado: string, dif: number): boolean {
    const tarea = buscarPorId(id);
    if (!tarea) {
        return false;
    }

    tarea.nombre = nombre;
    tarea.descripcion = desc;
    tarea.estado = estado;
    tarea.dificultad = dif;
    return true;
}