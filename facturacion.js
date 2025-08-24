// ===== FUNCIÓN PARA DESCARGAR FACTURA =====
function descargarFactura(html) {
    try {
        console.log('Descargando factura...');
        
        // Crear una nueva ventana
        const ventana = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes,resizable=yes');
        
        if (ventana) {
            // Escribir el contenido HTML en la nueva ventana
            ventana.document.write(html);
            ventana.document.close();
            
            // Esperar un momento para que se cargue el contenido
            setTimeout(() => {
                ventana.print();
                mostrarNotificacion('✅ Factura descargada correctamente');
            }, 500);
        } else {
            console.error('No se pudo abrir la ventana de impresión');
            mostrarNotificacion('❌ Error al descargar la factura');
        }
    } catch (error) {
        console.error('Error al descargar factura:', error);
        mostrarNotificacion('❌ Error al descargar la factura');
    }
}

// ===== FUNCIÓN PARA ENVIAR FACTURA POR EMAIL =====
function enviarFacturaEmail(email, factura) {
    // Simular envío de email
    mostrarNotificacion(`📧 Factura enviada por email a ${email}`);
}

// ===== FUNCIÓN PARA ENVIAR FACTURA POR WHATSAPP =====
function enviarFacturaWhatsApp(telefono, factura) {
    const mensaje = encodeURIComponent(`Hola! Tu factura ${factura.numero} está lista. Puedes descargarla desde el sistema.`);
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
}

// ===== FUNCIÓN PARA ENVIAR FACTURA AL CLIENTE =====
function enviarFacturaCliente(datos) {
    const factura = window.facturaActual;
    if (!factura) {
        console.error('No se encontró la factura actual');
        return;
    }
    
    console.log('Opciones de entrega de factura:', datos.entregaFactura);
    
    // Si no hay opciones seleccionadas, descargar por defecto
    if (!datos.entregaFactura || datos.entregaFactura.length === 0) {
        console.log('No hay opciones de entrega seleccionadas, descargando factura por defecto');
        descargarFactura(factura.html);
        return;
    }
    
    datos.entregaFactura.forEach(opcion => {
        console.log('Procesando opción de entrega:', opcion);
        switch (opcion) {
            case 'descargar':
                descargarFactura(factura.html);
                break;
            case 'email':
                enviarFacturaEmail(datos.emailCliente, factura);
                break;
            case 'whatsapp':
                enviarFacturaWhatsApp(datos.telefonoCliente, factura);
                break;
        }
    });
}

// ===== FUNCIÓN PARA ENVIAR FACTURA POR TRANSFERENCIA =====
function enviarFacturaTransferencia(datos) {
    const factura = window.facturaActual;
    if (!factura) return;
    
    // Enviar a WhatsApp de la empresa
    const mensajeEmpresa = `
        🏢 FRIOCAS - Nueva Compra por Transferencia
        
        Cliente: ${datos.nombreCliente}
        Total: $${datos.esCompraCarrito ? 
            datos.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toLocaleString('es-AR') :
            (datos.producto.precio * datos.cantidad).toLocaleString('es-AR')
        }
        
        N° Factura: ${factura.numero}
        
        Por favor, procesar la transferencia y confirmar al cliente.
    `;
    
    const mensajeCodificado = encodeURIComponent(mensajeEmpresa);
    window.open(`https://wa.me/${CONFIG_EMPRESA.whatsapp}?text=${mensajeCodificado}`, '_blank');
    
    // Procesar opciones de entrega del cliente
    datos.entregaFactura.forEach(opcion => {
        switch (opcion) {
            case 'descargar':
                descargarFactura(factura.html);
                break;
            case 'email':
                enviarFacturaEmail(datos.emailCliente, factura);
                break;
            case 'whatsapp':
                enviarFacturaWhatsApp(datos.telefonoCliente, factura);
                break;
        }
    });
}


