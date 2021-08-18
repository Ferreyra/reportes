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
  const titulo = document.getElementById('titulo')
  pdf.text(titulo.children[0].innerText, 58, 84)
  pdf.rect(58, 94, 494, 66)     
  pdf.line(58, 127, 552, 127)   
  pdf.line(305, 94, 305, 160)   // Mitad de la tabla 305
  pdf.line(100, 94, 100, 160)   
  pdf.line(345, 94, 345, 160)   // Separador segunda columna  
  pdf.rect(90, 164, 215, 129)
  pdf.rect(90, 293, 215, 129)
  pdf.rect(90, 422, 215, 129)
  pdf.rect(90, 551, 215, 129)
  pdf.rect(337, 164, 215, 129)
  pdf.rect(337, 293, 215, 129)
  pdf.rect(337, 422, 215, 129)
  pdf.rect(337, 551, 215, 129)
  pdf.rect(95, 688, 216, 59)
  pdf.setFontSize(9)
  pdf.text('Placa de Identificación', 70, 170, 270)
  pdf.text('Clave CABMS', 318, 170, 270)
  pdf.text('Antes del servicio', 70, 298, 270)
  pdf.text('Antes del servicio', 318, 298, 270)
  pdf.text('Durante el servicio', 70, 427, 270)
  pdf.text('Durante el servicio', 318, 427, 270)
  pdf.text('Después del servicio', 70, 557, 270)
  pdf.text('Después del servicio', 318, 557, 270)
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
  const reader = new FileReader()  
  const imgtag = document.getElementById(imgTxt)
  imgtag.alt = selectedFile.name
  reader.onload = (evento) => imgtag.src = evento.target.result    
  reader.readAsDataURL(selectedFile)
  document.getElementById(imgTxt).classList.remove("visually-hidden")
}

function createPDF(event) { 
  event.preventDefault()
  // impresión textos
  pdf.setFontSize(18)
  const mantPoC = document.getElementById('correctivo').selectedOptions[0].text
  pdf.text(mantPoC, 248, 84)
  pdf.setFontSize(12)
  const lFecha = document.getElementById('lFecha')
  const txtFecha = document.getElementById('fechaInput')
  let inFecha = txtFecha.value.replace(" de ", "-").replace(" de ", "-")
  inFecha = inFecha.split(' ')
  if (inFecha[1] === undefined) {
    inFecha = inFecha[0]
  } else {
    inFecha = inFecha[1]
  }  
  pdf.text(lFecha.innerText, 368, 86)
  pdf.text(txtFecha.value, 410, 86)
  const ubicacion = document.getElementById('ubicaInput').value
  pdf.text(ubicacion, 454, 72)

  pdf.setFontSize(10)
  pdf.text('Elaboró:', 110, 702)
  pdf.text('Ing. Fernando Monzón Arellano', 125, 733)
  const lEquipo = document.getElementById('lEquipo')
  const txtEquipo = document.getElementById('equipoInput')  
  pdf.text(lEquipo.innerText, 62, 114)
  pdf.text(txtEquipo.value, 104, 114)

  const lModelo = document.getElementById('lModelo')
  // const txtModelo = document.getElementById('modeloSelect').selectedOptions[0].text
  const txtModelo = document.getElementById('modeloInput')
  pdf.text(lModelo.innerText, 62, 147)
  pdf.text(txtModelo.value, 104, 147)

  const lSerie = document.getElementById('lSerie')
  const txtSerie = document.getElementById('serieInput')
  pdf.text(lSerie.innerText, 308, 147)
  pdf.text(txtSerie.value, 350, 147)

  const lMarca = document.getElementById('lMarca')
  // const txtMarca = document.getElementById('marcaSelect').selectedOptions[0].text
  const txtMarca = document.getElementById('marcaInput')
  pdf.text(lMarca.innerText, 308, 114)
  pdf.text(txtMarca.value, 350, 114)

  pdf.setFontSize(9)
  const cabms = document.getElementById('CABMSInput').value
  pdf.text(cabms, 340, 170, 270)

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