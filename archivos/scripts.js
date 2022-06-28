var url = window.location.href;
const { jsPDF } = window.jspdf;

var swLocation = '/reportes/sw.js';
var pdf, formato = true
const formulario = document.querySelector('form')
const canvas = document.getElementById('offcanvasTop')
const iframe = document.getElementById('iframePDF')
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

function formatoPDF() {
  if (formato) {
    // formato inicial
    pdf.setFontSize(18)  
    pdf.text('Reporte mantenimiento', 58, 84)
    pdf.setFontSize(12)
    pdf.text('Fecha:', 368, 86)
    pdf.setFontSize(10)
    pdf.text('Elaboró:', 98, 702)
    pdf.text('Ing. Fernando Monzón Arellano', 115, 735)
    pdf.text('Equipo:', 62, 114)
    pdf.text('Lugar:', 392, 114) 
    pdf.text('Modelo:', 62, 147) 
    pdf.text('Marca:', 227, 147) 
    pdf.text('Serie:', 392, 147)  
    pdf.rect(58, 94, 495, 66)     
    pdf.line(58, 127, 552, 127)    // Separador renglones  
    pdf.line(223, 127, 223, 160)
    pdf.line(388, 94, 388, 160)    // Mitad de la tabla 305
    pdf.line(100, 94, 100, 160)    // Divisiones /3  
    pdf.line(261, 127, 261, 160) 
    pdf.line(422, 94, 422, 160)
    pdf.rect(90, 164, 215, 129)
    pdf.rect(90, 293, 215, 129)
    pdf.rect(90, 422, 215, 129)
    pdf.rect(90, 551, 215, 129)
    pdf.rect(337, 164, 215, 129)
    pdf.rect(337, 293, 215, 129)
    pdf.rect(337, 422, 215, 129)
    pdf.rect(337, 551, 215, 129)
    pdf.rect(94, 688, 187, 59)
    pdf.setFontSize(9)
    pdf.text('Placa de Identificación', 70, 170, 270)
    pdf.text('CABMS', 318, 170, 270)
    pdf.text('Antes del servicio', 70, 298, 270)
    pdf.text('Antes del servicio', 318, 298, 270)
    pdf.text('Durante el servicio', 70, 427, 270)
    pdf.text('Durante el servicio', 318, 427, 270)
    pdf.text('Después del servicio', 70, 557, 270)
    pdf.text('Después del servicio', 318, 557, 270)

  } else {
    pdf.setDrawColor(135, 135, 135)
    pdf.setLineWidth(2)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(58, 68, 498, 683, 15, 15)
    pdf.roundedRect(169, 58, 285, 24, 10, 10, 'FD')
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
  pdf = new jsPDF('p', 'pt', 'letter', false, true)
  formatoPDF()
  iframe.src = ""
}

function limpiarImgs() {
  const imagenes = formulario.getElementsByTagName('img')
  for (const imagen of imagenes) {
    imagen.removeAttribute('alt')
    imagen.removeAttribute('src')
    imagen.classList.add("hidden")
  }
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
        const scaleSize = 512 / e.target.height        
        canvas.width = e.target.width * scaleSize
        canvas.height = 512
        const ctx = canvas.getContext("2d") 
        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height) 
        const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg")
        imgtag.src = srcEncoded
      }
    }
    document.getElementById(imgTxt).classList.remove("hidden")
  }
}

function strNdos (str) {
  let strArr = str.split(' ')
  let i = 0
  let lgWords = strArr[0].length
  do {
    i++
    lgWords += strArr[i].length + 1
  } while (lgWords <= 40)
  lgWords -= strArr[i].length
  strArr[0] = str.substr(0, lgWords)
  strArr[1] = str.substr(lgWords)
  return [strArr[0], strArr[1]]
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
    pdf.setFontSize(18)
    const mantPoC = document.getElementById('correctivo').selectedOptions[0].text
    pdf.text(mantPoC, 248, 84)

    pdf.setFontSize(10)
    pdf.text(txtFecha, 410, 86)
    pdf.text(ubicacion, 428, 114)    
    const txtEquipo = document.getElementById('equipoInput').value    
    if (txtEquipo.length > 40) {
      let t2Equipo = strNdos(txtEquipo)
      pdf.text(t2Equipo[0], 104, 107)
      pdf.text(t2Equipo[1], 104, 121)
    } else {
      pdf.text(txtEquipo, 104, 114)
    }

    const txtModelo = document.getElementById('modeloInput')
    pdf.text(txtModelo.value, 104, 147)
    const txtMarca = document.getElementById('marcaInput')
    pdf.text(txtMarca.value, 265, 147)

    pdf.text(txtSerie.value, 428, 147)

    const fotos = formulario.getElementsByTagName('img')
    let i = 1, x = 93, y = 168
    for (const foto of fotos) {
      if ( i % 2 === 0) {
        x = 340      
      } else {
        x = 93
      }
      if ( i > 2 && i < 5) {
        y = 295
      }
      if ( i > 4 && i < 7) {
        y = 425
      }
      if ( i > 6) {
        y = 554
      }
      if (foto.alt !== "") {
        let fotoWidth = 209, xOffset = 0
        if (foto.width < fotoWidth) {
          xOffset = Math.floor((fotoWidth - foto.width) / 2)
          x += xOffset
          fotoWidth = foto.width
        }
        pdf.addImage(foto, 'JPEG', x, y, fotoWidth, 123, undefined, 'MEDIUM')
      }    
      i++
    }
    pdf.setFontSize(9)
    const cabms = document.getElementById('CABMSInput').value
    pdf.text(cabms, 318, 205, 270)
    
    const gafet = document.getElementById('gfm')
    pdf.addImage(gafet.src, 'JPEG', 282, 642, 73, 105, undefined, 'MEDIUM')
  
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
      let t2Equipo = strNdos(txtEquipo)
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

    const fotos = formulario.getElementsByTagName('img')
    let i = 1, x = 83, y = 153   // y-15  x-10
    for (const foto of fotos) {
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
        let fotoWidth = 209, xOffset = 0
        if (foto.width < fotoWidth) {
          xOffset = Math.floor((fotoWidth - foto.width) / 2)
          x += xOffset
          fotoWidth = foto.width
        }
        pdf.addImage(foto, 'JPEG', x, y, fotoWidth, 123, undefined, 'MEDIUM')
      }    
      i++
    }
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(82, 149, 105, 15, 8, 8, 'F')
    pdf.text('Placa de Identificación', 90, 160)
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
