let h1 = document.getElementById("informacion");

class Tabla {
  constructor(id, esPrimeraTabla = false) {
    this.table = document.getElementById(id);
    this.crearTabla();
    this.ocupadas = new Set();
    this.longitudes = [5, 4, 3, 3, 2];
    this.indiceActual = 0;
    this.esPrimeraTabla = esPrimeraTabla;
    this.lineasCompletadas = false;
    this.escucharClicks();
  }

  marcarAleatorio() {
    const filas = this.table.getElementsByTagName("tr");
    let verificador = true;

    while (verificador) {
      const filaRandom = Math.floor(Math.random() * 10);
      const colRandom = Math.floor(Math.random() * 10);
      const celda = filas[filaRandom].children[colRandom];

      //aliadogolpeado
      //fallo
      if(celda.classList.contains("fallo") === false && celda.classList.contains("aliadoGolpeado") === false && celda.classList.contains("barcoAliado") === true){
        celda.classList.add("aliadoGolpeado");
        celda.classList.remove('barcoAliado');
        verificador = false;
      }else if(celda.classList.contains("fallo") === false && celda.classList.contains("aliadoGolpeado") === false && celda.classList.contains("barcoAliado") === false){
        celda.classList.add("fallo");
        verificador = false;
      }
    }
  }

  crearTabla() {
    for (let i = 0; i < 10; i++) {
      let fila = document.createElement("tr");
      for (let j = 0; j < 10; j++) {
        let celda = document.createElement("td");
        celda.dataset.fila = i;
        celda.dataset.columna = j;
        fila.appendChild(celda);
      }
      this.table.appendChild(fila);
    }
  }

  escucharClicks() {
    if (!this.esPrimeraTabla) return;
    this.table.addEventListener("click", (event) => {
      if (this.indiceActual >= this.longitudes.length) return;

      const celda = event.target;
      if (celda.tagName !== "TD") return;

      const fila = parseInt(celda.dataset.fila);
      const columna = parseInt(celda.dataset.columna);
      const longitud = this.longitudes[this.indiceActual];

      const direccion = confirm(
        `Colocar línea de ${longitud} horizontal? (Cancelar = vertical)`
      )
        ? "horizontal"
        : "vertical";

      if (this.colocarLineaManual(fila, columna, longitud, direccion)) {
        this.indiceActual++;
      } else {
        alert("No se puede colocar en esta posicion");
      }
      if (this.indiceActual >= this.longitudes.length) {
        this.lineasCompletadas = true;
        h1.textContent = "dispara";
      }
    });
  }

  colocarLineaManual(fila, columna, longitud, direccion) {
    const filas = this.table.getElementsByTagName("tr");

    let espacioLibre = true;
    let posiciones = [];

    if (direccion === "horizontal") {
      if (columna + longitud > 10) return false;

      for (let i = 0; i < longitud; i++) {
        let key = `${fila},${columna + i}`;
        if (this.ocupadas.has(key)) {
          espacioLibre = false;
          break;
        }
        posiciones.push(key);
      }
    } else {
      if (fila + longitud > 10) return false;

      for (let i = 0; i < longitud; i++) {
        let key = `${fila + i},${columna}`;
        if (this.ocupadas.has(key)) {
          espacioLibre = false;
          break;
        }
        posiciones.push(key);
      }
    }

    if (espacioLibre) {
      posiciones.forEach((key) => {
        const [f, c] = key.split(",").map(Number);
        filas[f].children[c].classList.add("barcoAliado");
        this.ocupadas.add(key);
      });
      return true;
    }

    return false;
  }

  colocarLinea(longitud) {
    let colocado = false;
    while (!colocado) {
      const horizontal = Math.random() < 0.5;
      const filas = this.table.getElementsByTagName("tr");

      if (horizontal) {
        const filaRandom = Math.floor(Math.random() * 10);
        const colInicio = Math.floor(Math.random() * (10 - longitud));

        let espacioLibre = true;
        for (let i = 0; i < longitud; i++) {
          if (this.ocupadas.has(`${filaRandom},${colInicio + i}`)) {
            espacioLibre = false;
            break;
          }
        }

        if (espacioLibre) {
          for (let i = 0; i < longitud; i++) {
            let celda = filas[filaRandom].children[colInicio + i];
            celda.classList.add("barcoEnemigo");
            this.ocupadas.add(`${filaRandom},${colInicio + i}`);
          }
          colocado = true;
        }
      } else {
        const colRandom = Math.floor(Math.random() * 10);
        const filaInicio = Math.floor(Math.random() * (10 - longitud));

        let espacioLibre = true;
        for (let i = 0; i < longitud; i++) {
          if (this.ocupadas.has(`${filaInicio + i},${colRandom}`)) {
            espacioLibre = false;
            break;
          }
        }

        if (espacioLibre) {
          for (let i = 0; i < longitud; i++) {
            let celda = filas[filaInicio + i].children[colRandom];
            celda.classList.add("barcoEnemigo");
            this.ocupadas.add(`${filaInicio + i},${colRandom}`);
          }
          colocado = true;
        }
      }
    }
  }

  verificarBarcosGolpeados () {
    const barcosTabla2 = document.querySelectorAll(".barcoEnemigo");
    const todosGolpeadosTabla2 = Array.from(barcosTabla2).every(celda => celda.classList.contains("golpeo"));
  
    if (todosGolpeadosTabla2) {
      h1.textContent = "GANASTE";
      alert("¡Todos los barcos de la tabla 2 han sido golpeados!");
      location.reload();
      return; 
    }
    const barcosTabla1 = document.querySelectorAll("#tabla1 .barcoAliado");
  
  
  const todosGolpeadosTabla1 = Array.from(barcosTabla1).every(celda => 
    !celda.classList.contains("barcoAliado") && celda.classList.contains("aliadoGolpeado")
  );

  if (todosGolpeadosTabla1) {
    alert("perdiste, que pete");
    location.reload(); 
  }
    

  
  };
  
}

class TablaRival extends Tabla {
  constructor(id) {
    super(id, false);
  }
}

const tabla1 = new Tabla("tabla1", true);
const tabla2 = new TablaRival("tabla2");

tabla2.table.addEventListener("click", (event) => {
  const celda = event.target;
  if (
    celda.tagName === "TD" &&
    celda.classList.contains("marcado") === false &&
    tabla1.lineasCompletadas === true &&
    celda.classList.contains("barcoEnemigo") === true &&
    celda.classList.contains("golpeo") === false
  ) {
    celda.classList.add("golpeo");
    tabla1.verificarBarcosGolpeados(); 
    tabla1.marcarAleatorio();
  } else if (
    celda.tagName === "TD" &&
    celda.classList.contains("marcado") === false &&
    tabla1.lineasCompletadas === true &&
    celda.classList.contains("barcoEnemigo") === false &&
    celda.classList.contains("golpeo") === false &&
    celda.classList.contains("fallo") === false
  ) {
    celda.classList.add("fallo");
    tabla1.marcarAleatorio();
    tabla1.verificarBarcosGolpeados(); 
  } 
});

tabla2.colocarLinea(5);
tabla2.colocarLinea(4);
tabla2.colocarLinea(3);
tabla2.colocarLinea(3);
tabla2.colocarLinea(2);
