class StorageSesion {

    name = "sesiondefault";
    // this.nombreBasicoParaAlmacenado = "data";
    nombreBasicoParaAlmacenado = "";
    //BASICOS

    constructor(dataName) {
        this.nombreBasicoParaAlmacenado = dataName
    }

    cargarX(nombre: string): string | null {
        try {
            return localStorage.getItem(nombre) || "";
        } catch (err) {
            console.log("no se pudo cargar de sesion:", err)
            return null
        }
    }

    guardarX(nombre: string, valor: string) {
        try {
            localStorage.setItem(nombre, valor);
            return true
        } catch (err) {
            console.log("no se pudo guardar en sesion:", err)
            return null
        }
    }

    eliminarX(nombre: string) {
        localStorage.removeItem(nombre);
    }
    //CON ESTRUCTURA

    //unico obligatorio es id
    getNombre(objeto): string {
        if (objeto.id == undefined) {
            objeto.id = 1;
        }
        return this.nombreBasicoParaAlmacenado + objeto.id;
    }

    agregar(objeto) {
        var objetoGuardar = JSON.stringify(objeto);
        return this.guardarX(this.getNombre(objeto), objetoGuardar);
    }

    guardar(objeto) {
        var objetoGuardar = JSON.stringify(objeto);
        return this.guardarX(this.getNombre(objeto), objetoGuardar);
    }

    editar(objeto) {
        var objetoGuardar = JSON.stringify(objeto);
        this.guardarX(this.getNombre(objeto), objetoGuardar);
    }


    eliminar(objeto) {
        this.eliminarX(this.getNombre(objeto));
    }


    cargar(objeto) {
        if (typeof (objeto) == "number") objeto = { id: objeto };
        const plain = this.cargarX(this.getNombre(objeto))
        if (!plain) return null
        try {
            return JSON.parse(plain);
        } catch (e) {
            return null
        }
    }

    verTodos() {
        for (var i in localStorage) {
            console.log('Log storage:' + i + ' = ' + localStorage[i]);
        }
    }

    getAll() {
        var all: any = {}
        for (var i in localStorage) {
            all[i] = localStorage[i]
        }

        return all
    }

    eliminarTodoStorage() {
        for (var i in localStorage) {
            this.eliminarX(i);
            console.log("Log storage: Eliminando.." + i);

        }
    }

    hasOne() {
        // console.log("hasOne de " + this.name);
        for (var i in localStorage) {
            // console.log("i", i);
            if (i.indexOf(this.nombreBasicoParaAlmacenado) == 0) {
                // console.log("devuelve true");
                return true;
            }
        }
        // console.log("devuelve false");
        return false;
    }

    getFirst() {
        for (var i in localStorage) {
            if (i.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
                var id = i.replace(this.nombreBasicoParaAlmacenado, "");
                var indice = this.nombreBasicoParaAlmacenado + id
                const leido = this.cargarX(indice)
                if (leido) {
                    return JSON.parse(leido)
                }
            }
        }
        return null;
    }

    cargarGuardados() {
        // verTodosStorages();
        var indice;
        var datos: any[] = [];
        for (var i in localStorage) {
            // console.log("i", i)
            if (i.indexOf(this.nombreBasicoParaAlmacenado) === 0) {
                indice = i.replace(this.nombreBasicoParaAlmacenado, "");
                try {
                    datos.push(
                        JSON.parse(this.cargarX(this.nombreBasicoParaAlmacenado + indice) + "")
                    );
                } catch (e) {
                    console.log("sesion storage: " + this.nombreBasicoParaAlmacenado);
                    console.log("no se pudo leer el elemento: " +
                        this.nombreBasicoParaAlmacenado +
                        indice +
                        " de la sesion del storage");
                }
            }
        }
        return datos;
    }

    truncate() {
        // verTodosStorages();
        var indice;
        var datos = [];
        for (var i in localStorage) {
            if (i.indexOf(this.nombreBasicoParaAlmacenado) > -1) {
                indice = i.replace(this.nombreBasicoParaAlmacenado, "");
                this.eliminarX(this.nombreBasicoParaAlmacenado + indice);
            }
        }
        return datos;
    }



    calcularEspacios() {
        var limiteStorage = 5240370;
        var resul = {}, total, mayor = 0, mayorId, indice, actual, nombreEnStorage;
        nombreEnStorage = this.nombreBasicoParaAlmacenado;
        total = 0;
        for (var i in localStorage) {
            //if(this.debug)console.log(i + ' = ' + localStorage[i]);
            actual = localStorage[i].length;
            if (mayor < actual) {
                mayor = actual;
                indice = -1;

                if (i.indexOf(nombreEnStorage) > -1) { indice = i.replace(nombreEnStorage, ""); }
                mayorId = indice;
            }
            total = parseInt(total) + parseInt(actual);
        }

        resul = {
            limiteStorage: limiteStorage,
            total: total,
            mayorId: mayorId,
            mayor: mayor
        };
        return resul;
    }


}


export default StorageSesion;