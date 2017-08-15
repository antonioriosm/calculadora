'use strict';

function Calculadora() {
    this.display = document.querySelector('#display'); // objeto display
    this.cadena = ""; // muesta en pantalla
    this.valor1 = 0; // primer operando
    this.valor2 = 0; // segundo operando
    this.espera = true; // espera sólo un operador
    this.signo = true; // flag para signo de número
    this.punto = true; // flag para punto decimal

    this.init = function() {
        this.configTeclas();
        this.cadena = "0";
        this.numero = 0;
        this.punto = true;
        this.valor1 = 0;
        this.valor2 = 0;
        this.operador = "";
    };

    this.controller = function(tecla) {
        let self;
        if (typeof(tecla) == 'object') { // para uso de la calculadora por mouse
            //tecla.srcElement.id ||
            tecla = tecla.srcElement.id ||tecla.originalTarget.id;
            self = calculadora;
        } else
            self = this;

        switch (tecla) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                self.verificaNumero(tecla);
                break;
            case "+":
            case "mas":
            case "-":
            case "menos":
            case "*":
            case "por":
            case "/":
            case "dividido":
            case "=":
            case "igual":
                self.verificaOperador(tecla);
                break;
            case ".":
            case "punto":
                self.verificaPunto();
                break;
            case "sign":
                self.verificaSigno();
                break;
            case "raiz":
                self.sacarRaiz();
                break;
            case "on":
                self.init();
                break;
            default:
                console.error('error', tecla);
                tecla = "";
                break;
        }
        self.cadena = (self.cadena.length > 7) ? self.cadena.substr(0, 8) : self.cadena;
        self.display.innerHTML = self.cadena;
        log('display', self.cadena, self.numero, self.valor1, self.valor2, self.operador);
    };

    this.verificaNumero = function(numero) {
        if (this.cadena === "0" && numero === 0) {
            return; // no permitimos agregar otro cero si ya existe en la pantalla
        }
        if (this.cadena === "0") {
            this.cadena = numero.toString();
        } else {
            if (this.cadena.length < 9) { // limitamos el ancho de pantalla
                this.cadena = this.cadena + numero.toString();
            }
        }
        this.espera = true; // activa espera de operador
        this.numero = parseFloat(this.numero.toString() + numero);
    };

    this.calcula = function() {
        log('cal-1', this.cadena, this.numero, this.valor1, this.valor2, this.operador);

        if (this.numero === 0) return;

        this.valor1 = this.valor2;
        this.valor2 = parseFloat(this.numero);

        switch (this.operador) {
            case "+":
                this.valor2 = this.valor1 + this.valor2;
                break;
            case "-":
                this.valor2 = this.valor1 - this.valor2;
                break;
            case "*":
                this.valor2 = this.valor1 * this.valor2;
                break;
            case "/":
                this.valor2 = this.valor1 / this.valor2;
                break;
            default:
                console.log('sin operacion');
                break;
        }
        this.valor1 = this.numero; //último operando
        this.numero = 0;
        log('cal-2', this.cadena, this.numero, this.valor1, this.valor2, this.operador);
    };

    this.verificaOperador = function(tecla) {
        if (tecla == "igual") tecla = "=";
        if (tecla == "mas") tecla = "+";
        if (tecla == "menos") tecla = "-";
        if (tecla == "por") tecla = "*";
        if (tecla == "dividido") tecla = "/";

        if (tecla == "=") {
            if (this.numero === 0) this.numero = this.valor1; // para repetir última operación
            this.calcula();
            this.cadena = this.valor2.toString();
            this.punto = true;
        } else {
            if (this.espera) {
                this.cadena = "";
                this.calcula();
                this.espera = false; // desactiva operador
                this.punto = true;
            } else { // cambia último operador registrado
                this.cadena = this.cadena.substr(0, this.cadena.length - 1) + tecla;
            }
            this.operador = tecla;
        }
    };

    this.verificaPunto = function() {
        if (this.punto) {
            if (this.cadena === "" || this.numero === 0) {
                this.cadena = "0.";
                this.valor2 = 0;
            } else {
                this.cadena = this.cadena + '.';
            }
            this.numero = this.numero.toString() + '.';
            this.punto = false;
        }
    };

    this.verificaSigno = function() {
        let self = this;
        if (self.cadena == "0") {
            return;
        }
        // para camnio de signo buscamos que sea un número sin signos de operación
        self.numero = parseFloat(self.cadena) * -1;
        self.cadena = self.numero.toString();

        log('verSig', self.cadena, self.numero, self.valor1, self.valor2);
    };

    this.sacarRaiz = function() {
        let self = this;
        if (parseFloat(self.cadena) > 0) {
            self.numero = Math.sqrt(parseFloat(self.cadena));
            self.cadena = self.numero.toString();
            self.valor2 = self.numero;
        } else { // error si se quiere sacar raiz cuadrada de números negativos
            self.cadena = "ERR";
        }
        self.numero = 0;
        //this.valor2 = 0;
        log('raiz', self.cadena, self.numero, self.valor1, self.valor2, self.operador);
    };
    /* Habilitamos las teclas de la calculadora para funcionar con el evento click */
    this.configTeclas = function() {
        let link = document.querySelectorAll("img[alt]");
        for (let i = 0; i < link.length; i++) {
            link[i].addEventListener('click', calculadora.controller);
        }
    };

    this.presionaTecla = function(event) {
        let tecla = event.which || event.keyCode;
        this.controller(String.fromCharCode(tecla));
    };
}

let calculadora = new Calculadora();
calculadora.init();

document.onkeypress = calculadora.presionaTecla;
/*document.onmousedown = efecto1;

function efecto1(event) {
    let alt = event.srcElement.alt;


    let boton = document.querySelector("img[alt='" + alt + "']");
    console.log(boton);

*/
function log(o, c, n, v1, v2, op) {
    console.log('o=>', o, 'c=>', c, 'n=>', n, 'v1=>', v1, 'v2=>', v2, 'op=>', op);
    //console.log(typeof(c), typeof(n));
}