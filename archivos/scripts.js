const IMAGE = {WIDTH: 242, HEIGHT: 242, 
               X1: 58,  Y1: 180, X2: 312, Y2: 122}
const FOTO = {WIDTH: IMAGE.WIDTH-4, HEIGHT: IMAGE.HEIGHT-4}

var url = window.location.href;
const { jsPDF } = window.jspdf;

var swLocation = '/reportes/sw.js';
var pdf, formato = true
const formulario = document.querySelector('form')
const canvas = document.getElementById('offcanvasTop')
const iframe = document.getElementById('iframePDF')
const fotos = formulario.querySelectorAll('img')
const cambiarFormato = document.getElementById('xFormato')
cambiarFormato.addEventListener('click', () => {
  formato = !formato
  let root = document.body;
  pdf = undefined
  leerDatos() 
  root.classList.toggle("lightMode");
})

if ( navigator.serviceWorker ) {
  if ( url.includes('localhost') ) {
    swLocation = '/sw.js';
  }
  navigator.serviceWorker.register( swLocation );
}

function formatoPDF() {             // formato inicial
  if (formato) {
    pdf.setFontSize(16)  
    pdf.text('Reporte fotográfico de mantenimiento', 58, 84)
    pdf.setFontSize(10)
    pdf.text('Fecha:', 368, 66)

    // horizontales
    pdf.rect(58, 94,  495, 77)
    pdf.line(58, 119, 552, 119)     // Separador renglones  
    pdf.line(58, 147, 552, 147)     // Separador renglones  
    // verticales
    pdf.line(100, 119, 100, 171)    // Divisiones /3  
    pdf.line(223, 146, 223, 171)
    pdf.line(261, 146, 261, 171) 
    pdf.line(307, 94,  307, 119)    // Mitad de la tabla 305
    pdf.line(388, 146, 388, 171)
    pdf.line(422, 119, 422, 171)
    // pdf.text('Lugar:', 392, 114)// posición vertical?    
    pdf.text('No. Inventario:', 62, 109)
    pdf.text('No. Orden:', 311, 109)
    pdf.text('Equipo:', 62, 135)    // Renglón medio
    pdf.text('Modelo:', 62, 164)    // Renglón bajo
    pdf.text('Marca:', 227, 164) 
    pdf.text('Serie:', 392, 164)
    pdf.rect(IMAGE.X1, IMAGE.Y1, IMAGE.WIDTH, IMAGE.HEIGHT+17)
    pdf.rect(IMAGE.X1, IMAGE.Y1+IMAGE.HEIGHT+27, IMAGE.WIDTH, IMAGE.HEIGHT+17)
    pdf.rect(IMAGE.X2, IMAGE.Y1, IMAGE.WIDTH, IMAGE.HEIGHT+17)
    pdf.rect(IMAGE.X2, IMAGE.Y1+IMAGE.HEIGHT+27, IMAGE.WIDTH, IMAGE.HEIGHT+17)

    pdf.setFontSize(9)    /* ajustar posición vertical */
    pdf.text('Placa de Identificación', IMAGE.X1+(IMAGE.WIDTH/2), IMAGE.Y1+13, {align: "center"})
    pdf.text('Clave CABMS', IMAGE.X2+(IMAGE.WIDTH/2), IMAGE.Y1+13, {align: "center"})
    pdf.text('Antes del servicio', IMAGE.X1+(IMAGE.WIDTH/2), IMAGE.Y1+IMAGE.HEIGHT+40, {align: "center"})
    pdf.text('Antes del servicio', IMAGE.X2+(IMAGE.WIDTH/2), IMAGE.Y1+IMAGE.HEIGHT+40, {align: "center"})

    /* Segunda hoja */
    pdf.addPage()
    pdf.rect(IMAGE.X1, IMAGE.Y2, IMAGE.WIDTH, IMAGE.HEIGHT+17)
    pdf.rect(IMAGE.X1, IMAGE.Y2+IMAGE.HEIGHT+27, IMAGE.WIDTH, IMAGE.HEIGHT+17)
    pdf.rect(IMAGE.X2, IMAGE.Y2, IMAGE.WIDTH, IMAGE.HEIGHT+17)
    pdf.rect(IMAGE.X2, IMAGE.Y2+IMAGE.HEIGHT+27, IMAGE.WIDTH, IMAGE.HEIGHT+17)
    pdf.setFontSize(9)
    pdf.text('Durante el servicio', IMAGE.X1+(IMAGE.WIDTH/2), IMAGE.Y2+13, {align: "center"})
    pdf.text('Durante el servicio', IMAGE.X2+(IMAGE.WIDTH/2), IMAGE.Y2+13, {align: "center"})
    pdf.text('Después del servicio', IMAGE.X1+(IMAGE.WIDTH/2), IMAGE.Y2+IMAGE.HEIGHT+40, {align: "center"})
    pdf.text('Después del servicio', IMAGE.X2+(IMAGE.WIDTH/2), IMAGE.Y2+IMAGE.HEIGHT+40, {align: "center"})

    /* Tercer hoja */
    pdf.addPage()
    pdf.rect(IMAGE.X1, IMAGE.Y2, IMAGE.WIDTH, IMAGE.HEIGHT+17)    
    pdf.rect(IMAGE.X2, IMAGE.Y2, IMAGE.WIDTH, IMAGE.HEIGHT+17)    
    pdf.setFontSize(9)    
    pdf.text('Etiqueta proveedor', IMAGE.X1+(IMAGE.WIDTH/2), IMAGE.Y2+13, {align: "center"})
    pdf.text('Gafete de personal', IMAGE.X2+(IMAGE.WIDTH/2), IMAGE.Y2+13, {align: "center"})
    pdf.rect(307-(188/2), IMAGE.Y2+IMAGE.HEIGHT+29, 188, 59)
    pdf.setFontSize(10)
    pdf.text('Elaboró:', 307-(188/2)+4, IMAGE.Y2+IMAGE.HEIGHT+42)
    pdf.text('Ing. Fernando Monzón Arellano', 307-69, IMAGE.Y2+IMAGE.HEIGHT+78)

  } else {
    pdf.setDrawColor(135, 135, 135)
    pdf.setLineWidth(2)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(58, 68, 498, 683, 15, 15)
    pdf.roundedRect(171, 58, 285, 24, 10, 10, 'FD')
    pdf.line(58, 148, 556, 148)
    pdf.setFont('times', 'normal', 'normal')
    pdf.setFontSize(18)  
    pdf.text('Reporte mantenimiento ', 188, 75)
    pdf.setFontSize(10)
    pdf.text('Equipo:', 66, 105)
    pdf.text('Serie:', 75, 132)
    pdf.text('Modelo:', 227, 132) 
    pdf.text('Fecha:', 392, 96)
    pdf.text('Marca:', 392, 116)
    pdf.text('Lugar:', 392, 137)
    pdf.roundedRect(217, 680, 163, 59, 8, 8)
    pdf.text('Elaboró:', 233, 694)
    pdf.text('Alejandro Mendoza Cruz', 255, 727)
  }
}
 
function fechaFormato (fecha) {
  const objFecha = new Date()
  if (fecha !== 'today') {
    fecha = fecha.split('-')
    objFecha.setFullYear(parseInt(fecha[0]))
    objFecha.setMonth(parseInt(fecha[1])-1)
    objFecha.setDate(parseInt(fecha[2]))
  }
  fecha = objFecha.toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric'})
  fecha = fecha.split(' de ')
  fecha[1] = fecha[1].charAt(0).toUpperCase() + fecha[1].slice(1)
  return fecha.join(' ')
}

function cambiarFecha(event) {
  document.getElementById('fechaUI').textContent = fechaFormato(event.target.value)
}

function leerDatos() {  
  document.getElementById('fechaUI').textContent = fechaFormato('today')
  let fotoHeight = FOTO.HEIGHT
  if ( !formato ) {
    fotoHeight = 123
  }
  fotos.forEach( foto => foto.height = fotoHeight )
  pdf = new jsPDF('p', 'pt', 'letter', false, true)
  formatoPDF()
  iframe.src = ""
}

function limpiarImgs() {
  fotos.forEach( foto => {
    foto.removeAttribute('alt')
    foto.removeAttribute('src')
    foto.classList.add("hidden")
  })
}

function onFileSelected(event, imgTxt) {
  const selectedFile = event.target.files[0]
  if (selectedFile) {  
    const reader = new FileReader()  
    const imgtag = document.getElementById(imgTxt)
    imgtag.alt = selectedFile.name     
    reader.readAsDataURL(selectedFile)
    reader.onload = (event) => {
      const imgElement = document.createElement('img')
      imgElement.src = event.target.result      
      imgElement.onload = (e) => {
        const canvas = document.createElement("canvas") 
        canvas.width = (768 * e.target.width) / e.target.height
        canvas.height = 768
        const ctx = canvas.getContext("2d") 
        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height) 
        const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg")
        imgtag.src = srcEncoded
      }
    }
    document.getElementById(imgTxt).classList.remove("hidden")
  }
}

function strNdos (str, length) {
  let strArr = str.split(' ')
  let i = 0
  let lgWords = strArr[0].length
  do {
    i++
    lgWords += strArr[i].length + 1
  } while (lgWords <= length)
  lgWords -= strArr[i].length
  strArr[0] = str.substr(0, lgWords)
  strArr[1] = str.substr(lgWords)
  return [strArr[0], strArr[1]]
}

function centrarFotoX (width) {
  return Math.floor((FOTO.WIDTH - width) / 2)
}

function centrarFotoY (foto) {
  foto.height = (FOTO.WIDTH * foto.height) / foto.width
  foto.width = FOTO.WIDTH
  return Math.floor((FOTO.HEIGHT - foto.height) / 2)
}

function createPDF(event) { 
  event.preventDefault()
  const ubicacion = document.getElementById('ubicaInput').value
  const txtSerie = document.getElementById('serieInput')
  const txtFecha = document.getElementById('fechaUI').textContent
  let inFecha = txtFecha.split(',')
  inFecha[1] = inFecha[1].trim().replaceAll(" ", "-")
  inFecha = inFecha[1]    

  if(formato) {
    pdf.setPage(1)
    pdf.setFontSize(16)
    const mantPoC = document.getElementById('correctivo').selectedOptions[0].text
    pdf.text(mantPoC, 330, 84)  //posición horizontal ?
    const eqMedico = document.getElementById('equipoMedico')
    if ( eqMedico.checked ) {
      pdf.text("a equipo médico", 408, 84)
    }
    pdf.setFontSize(10)
    pdf.text(txtFecha, 410, 66)
    const cabms = document.getElementById('CABMSInput').value
    pdf.text(cabms, 136, 109)
    const nOrden = document.getElementById('noOrden').value
    pdf.text(nOrden, 392, 109)
    pdf.text(ubicacion, 428, 135)    
    const txtEquipo = document.getElementById('equipoInput').value
    if (txtEquipo.length > 45) {
      let t2Equipo = strNdos(txtEquipo, 45)
      pdf.text(t2Equipo[0], 104, 130) // 135-5
      pdf.text(t2Equipo[1], 104, 142) // 135+7
    } else {
      pdf.text(txtEquipo, 104, 135)
    }
    const txtModelo = document.getElementById('modeloInput')
    pdf.text(txtModelo.value, 104, 164)
    const txtMarca = document.getElementById('marcaInput')
    pdf.text(txtMarca.value, 265, 164)
    pdf.text(txtSerie.value, 428, 164)

    let i = 1, x, y = IMAGE.Y1 + 20
    fotos.forEach ( foto => {
      if ( i % 2 === 0) {
        x = IMAGE.X2 + 2      
      } else {
        x = IMAGE.X1 + 2
      }
      if ( i > 2 && i < 5) {
        y = IMAGE.Y1 + IMAGE.HEIGHT + 47
      }
      if ( i > 4 && i < 9) {
        pdf.setPage(2)       // hoja 2
        if ( i < 7) {
          y = IMAGE.Y2 + 20
        }
        if ( i > 6 ) {
          y = IMAGE.Y2 + IMAGE.HEIGHT + 47
        }
      }      
      if ( i > 8 ) {
        pdf.setPage(3)       // hoja 3
        x = IMAGE.X1 + 2
        y = IMAGE.Y2 + 20
      }
      if (foto.alt !== "") {
        if (foto.width < FOTO.WIDTH) {
          x += centrarFotoX(foto.width)
        }
        if (foto.width > FOTO.WIDTH) {
          y += centrarFotoY(foto)
        }
        pdf.addImage(foto, 'JPEG', x, y, foto.width, foto.height, undefined, 'MEDIUM')
      }    
      i++
    })
    const gafete = document.getElementById('gfm')
    /* gafete.width = (FOTO.HEIGHT * gafete.width) / gafete.height
    gafete.height = FOTO.HEIGHT
    x = IMAGE.X2 + centrarFotoX(gafete.width) */
    x = IMAGE.X2 + 2
    pdf.addImage(gafete.src, 'JPEG', x, y, FOTO.WIDTH, FOTO.HEIGHT, undefined, 'MEDIUM')
  
  } else {

    pdf.setFontSize(18)
    const mantPoC = document.getElementById('correctivo').selectedOptions[0].text
    pdf.text(mantPoC, 363, 75)

    pdf.setFontSize(10)    
    const pdfFecha = inFecha.replaceAll("-", "/")    
    pdf.text(pdfFecha, 428, 96)
    pdf.text(ubicacion, 428, 137)    
    const txtEquipo = document.getElementById('equipoInput').value    
    if (txtEquipo.length > 40) {
      let t2Equipo = strNdos(txtEquipo, 40)
      pdf.text(t2Equipo[0], 106, 100)
      pdf.text(t2Equipo[1], 106, 114)
    } else {
      pdf.text(txtEquipo, 106, 105)
    }

    const txtModelo = document.getElementById('modeloInput')
    pdf.text(txtModelo.value, 268, 132)
    const txtMarca = document.getElementById('marcaInput')
    pdf.text(txtMarca.value, 428, 116)    
    pdf.text(txtSerie.value, 106, 132)

    let i = 1, x = 83, y = 153   // y-15  x-10
    fotos.forEach ( foto => {
      if ( i % 2 === 0) {
        x = 335  // -5
      } else {
        x = 83  // -10
      }
      if ( i > 2 && i < 5) {
        y = 280
      }
      if ( i > 4 && i < 7) {
        y = 410
      }
      if ( i > 6) {
        y = 539
      }
      if (foto.alt !== "") {        
        if (foto.width < 209) {          
          x += centrarFotoX(foto.width)
        }
        pdf.addImage(foto, 'JPEG', x, y, foto.width, foto.height, undefined, 'MEDIUM')
      }    
      i++
    })
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(82, 149, 105, 15, 8, 8, 'F')
    pdf.text('Placa de Identificación', 58, 160)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(332, 149, 120, 15, 8, 8, 'F')
    pdf.text('CABMS', 340, 160)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(270, 276, 96, 15, 8, 8, 'F')
    pdf.text('Antes del servicio', 280, 288)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(270, 405, 98, 15, 8, 8, 'F')
    pdf.text('Durante el servicio', 279, 417)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(267, 536, 100, 15, 8, 8, 'F')
    pdf.text('Después del servicio', 276, 547)    
    
    const cabms = document.getElementById('CABMSInput').value
    pdf.text(cabms, 378, 160)
    
    const gafet = document.getElementById('gd')
    pdf.addImage(gafet.src, 'JPEG', 142, 650, 73, 100, undefined, 'MEDIUM')
  }
  
  iframe.src = pdf.output('datauristring')
  
  document.getElementById('btnDescargar').addEventListener('click', () => {
    pdf.save(ubicacion +' '+ txtSerie.value +' '+ inFecha +'.pdf')
    canvas.classList.remove('show')
    formulario.reset()
    limpiarImgs()
  })
}

canvas.addEventListener('hide.bs.offcanvas', ()=> {
  pdf = undefined
  leerDatos()
})
