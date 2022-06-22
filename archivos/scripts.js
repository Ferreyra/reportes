var url = window.location.href;
const { jsPDF } = window.jspdf;

var swLocation = '/reportes/sw.js';
var pdf
const canvas = document.getElementById('offcanvasTop')
const iframe = document.getElementById('iframePDF')

if ( navigator.serviceWorker ) {
  if ( url.includes('localhost') ) {
    swLocation = '/sw.js';
  }
  navigator.serviceWorker.register( swLocation );
}

function formatoPDF() {
  // impresión recuadros de tabla
  pdf.setFontSize(18)  
  pdf.text('Reporte mantenimiento', 58, 84)
  pdf.setFontSize(12)
  pdf.text('Fecha:', 368, 86)

  pdf.setFontSize(10)
  pdf.text('Elaboró:', 100, 702)
  pdf.text('Ing. Fernando Monzón Arellano', 115, 733)
  pdf.text('Equipo:', 62, 114)
  pdf.text('Lugar:', 392, 114) 
  pdf.text('Modelo:', 62, 147) 
  pdf.text('Marca:', 227, 147) 
  pdf.text('Serie:', 392, 147)  
  pdf.rect(58, 94, 495, 66)     
  pdf.line(58, 127, 552, 127)    // Separador renglones  

  pdf.line(223, 127, 223, 160)   // Mitad de la tabla 305
  pdf.line(388, 94, 388, 160)    // Mitad de la tabla 305

  pdf.line(100, 94, 100, 160)   
  pdf.line(263, 127, 263, 160) 
  pdf.line(428, 94, 428, 160)

  pdf.rect(90, 164, 215, 129)
  pdf.rect(90, 293, 215, 129)
  pdf.rect(90, 422, 215, 129)
  pdf.rect(90, 551, 215, 129)
  pdf.rect(337, 164, 215, 129)
  pdf.rect(337, 293, 215, 129)
  pdf.rect(337, 422, 215, 129)
  pdf.rect(337, 551, 215, 129)
  pdf.rect(90, 688, 200, 59)
  pdf.setFontSize(9)
  pdf.text('Placa de Identificación', 70, 170, 270)
  pdf.text('Clave CABMS', 318, 170, 270)
  pdf.text('Antes del servicio', 70, 298, 270)
  pdf.text('Antes del servicio', 318, 298, 270)
  pdf.text('Durante el servicio', 70, 427, 270)
  pdf.text('Durante el servicio', 318, 427, 270)
  pdf.text('Después del servicio', 70, 557, 270)
  pdf.text('Después del servicio', 318, 557, 270)
  pdf.addImage('gfm.png', 'png', 290, 622, 60, 85, undefined, 'MEDIUM')
}

function leerDatos() {
  let fecha = new Date(Date.now())
  document.getElementById('fechaInput').value = fecha.toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric'})
  pdf = new jsPDF('p', 'pt', 'letter', false, true)
  formatoPDF()
  iframe.src = ""
}

function limpiarImgs() {
  const imagenes = document.querySelectorAll('img')
  imagenes.forEach(imagen => {
    imagen.removeAttribute('alt')
    imagen.removeAttribute('src')
    imagen.classList.add("visually-hidden")
  });
}

function onFileSelected(event, imgTxt) {
  const selectedFile = event.target.files[0]
  if (selectedFile) {  
    const reader = new FileReader()  
    const imgtag = document.getElementById(imgTxt)
    imgtag.alt = selectedFile.name    
    console.log('size', selectedFile.size)
    reader.readAsDataURL(selectedFile)
    reader.onload = (event) => {
      const imgElement = document.createElement('img')
      imgElement.src = event.target.result      
      imgElement.onload = (e) => {
        const canvas = document.createElement("canvas"); 
        console.log('oH:', e.target.height)   
        const scaleSize = 750 / e.target.height;
        console.log('Escala', scaleSize)
        canvas.width = e.target.width * scaleSize; 
        canvas.height = 750
        const ctx = canvas.getContext("2d"); 
        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height); 
        const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
        imgtag.src = srcEncoded
      }
    }
    document.getElementById(imgTxt).classList.remove("visually-hidden")
  }
}

function strNdos (str) {
  let strArr = str.split(' ')
  let i = 0
  let lgWords = strArr[0].length
  do {
    i++
    lgWords += strArr[i].length + 1
  } while (lgWords <= 32)
  lgWords -= strArr[i].length
  strArr[0] = str.substr(0, lgWords)
  strArr[1] = str.substr(lgWords)
  return [strArr[0], strArr[1]]
}

function createPDF(event) { 
  event.preventDefault()
  // impresión textos
  pdf.setFontSize(18)
  const mantPoC = document.getElementById('correctivo').selectedOptions[0].text
  pdf.text(mantPoC, 248, 84)
  pdf.setFontSize(10)
  
  const txtFecha = document.getElementById('fechaInput')
  let inFecha = txtFecha.value.replace(" de ", "-").replace(" de ", "-")
  inFecha = inFecha.split(' ')
  if (inFecha[1] === undefined) {
    inFecha = inFecha[0]
  } else {
    inFecha = inFecha[1]
  }
  pdf.text(txtFecha.value, 410, 86)

  const ubicacion = document.getElementById('ubicaInput').value
  pdf.text(ubicacion, 432, 114)    
  const txtEquipo = document.getElementById('equipoInput').value    
  if (txtEquipo.length > 32) {
    let t2Equipo = strNdos(txtEquipo)
    pdf.text(t2Equipo[0], 104, 107)
    pdf.text(t2Equipo[1], 104, 121)
  } else {
    pdf.text(txtEquipo, 104, 114)
  }

  const txtModelo = document.getElementById('modeloInput')
  pdf.text(txtModelo.value, 104, 147)
  const txtMarca = document.getElementById('marcaInput')
  pdf.text(txtMarca.value, 267, 147)
  const txtSerie = document.getElementById('serieInput')
  pdf.text(txtSerie.value, 432, 147)  

  const fotos = document.getElementsByTagName('img')
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
  pdf.text(cabms, 340, 170, 270)
  
  iframe.src = pdf.output('datauristring') 
  
  document.getElementById('btnDescargar').addEventListener('click', () => {    
    pdf.save(ubicacion +' '+ txtEquipo.value +' '+ inFecha +'.pdf')
    canvas.classList.remove('show')
    // window.location.reload()
    document.querySelector('form').reset()
    limpiarImgs()
  })
}

canvas.addEventListener('hide.bs.offcanvas', ()=> {
  leerDatos()
})
