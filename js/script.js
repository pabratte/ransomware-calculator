const app = new Vue({
    el:'#app',
    data:{
        page: 1,
        error:false,
        escenario:false,
        nombreEscenario:"",
        scenario_totals: {},
        data_scenarios: [],
        x : 0,
        user_data: {
            //DATOS GENERALES
            hLab:undefined,
            cHorasEmpleado:undefined,
            cantEquipos:undefined,
            
            //BACKUPS
            chUltiBackup:undefined,
            chRegeInfoTotal:undefined,

            //RECUPERAR FORMATEAR
            chFormatear:undefined,
            cFormatear:undefined,
            cantEquiposParaleloFormatear:undefined,

            //RECUPERAR RESTAURAR
            chRestaurar:undefined,
            cRestaurar:undefined,
            cantEquiposParaleloRestaurar:undefined,

            //RESCATE
            cRescate:undefined,
            
            //PERDIDA
            porcenEquiposInfectados:undefined,
            cOportunidadVentas:undefined,
            cReputacion:undefined,
            cFiltradoInfo:undefined,
        },

    //COLORS
    primary:"#4e73df",
    success: "#1cc88a", 
    info: "#36b9cc",                                        
    warning: "#f6c23e",
    danger: "#e74a3b",
    secondary:"#858796", 
    },
    
    methods:{
        createPdf:function(){
            this.mostrar_cn=true
            this.mostrar_ct=true
            const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                orientation:"portrait",
            });
            
            const RENDER_SIZE = "1000px";
            document.body.style.width=RENDER_SIZE;
            
            var pages = document.getElementsByClassName("report-page");
            console.log(pages);
            function renderPage(pages, currentPage){
                var elem = pages[currentPage];
                
                window.setTimeout(function(){
                    domtoimage.toPng(elem, {bgcolor: '#FFF'})
                        .then(function (dataUrl) {
                            
                            var page = doc.addPage()
                            page.addImage(dataUrl, 'JPEG', 0, 0);
                            console.log("rendering page "+currentPage)
                            
                            if(currentPage+1 < pages.length){
                                renderPage(pages, currentPage+1);
                            }else{
                                // restore element size
                                document.body.style.removeProperty("width")
                                doc.save("a4.pdf");
                            }
                        })
                        .catch(function (error) {
                            alert("Ha ocurrido un error: "+error)
                            console.error('Ha ocurrido un error', error);
                        });
                }, 0.5);
                
            }
            renderPage(pages, 0)            
        },

        mostrar: function(){
            this.page += 1,
            this.globalChart()
        },
        removeclass: function(div){
            div.classList.remove("text-primary")
            div.classList.remove("text-success")
            div.classList.remove("text-info")
            div.classList.remove("text-warning")
            div.classList.remove("text-danger")
            div.classList.remove("text-secondary")
        },
        globalChart(){
            
            var ctx = document.getElementById('globalchart').getContext('2d');
            var totals = [];
            Object.entries(this.scenario_totals).forEach(([key, value]) => {
                totals.push(value);
            });
            //ver como recorremos el arreglo data_scenarios y encontrar de cada diccionario el valor de "total"
            //no usamos más scenario_totals
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.scenario_totals),
                    datasets: [{
                        data: totals,
                        backgroundColor: [
                            this.primary,
                            this.success,
                            this.info,
                            this.warning,
                            this.danger,
                            this.secondary,
                        ]
                    }]
                },
                options:{
                    legend: {
                        display: false
                    },
                    tooltips: {
                        titleMarginBottom: 10,
                        titleFontColor: '#6e707e',
                        titleFontSize: 14,
                        backgroundColor: "rgb(255,255,255)",
                        bodyFontColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                        callbacks: {
                          label: function(tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + '$ ' + tooltipItem.yLabel;
                            }
                        }
                    }
                }
                
            });
        },
        isValid: function(v){
            if(v === undefined || isNaN(v) || v==="" || v<"1"){
                return false;
            }else{
                return true;
            }
        },

        register_scenario_total(scenario, total){
            console.log("scenario: "+scenario.nombre)
            console.log("total: "+total)
            console.log("color: "+scenario.color)
            this.data_scenarios[this.x].total=total
            this.x=this.x+1
        },
        validate: function(){ 
            switch (this.page) {
                case 1: //DATOS GENERALES VALIDACION
                    if (this.isValid(this.user_data.hLab) && this.isValid(this.user_data.cHorasEmpleado) && this.isValid(this.user_data.cantEquipos)){
                        this.error=false
                        this.page += 1
                    }else{
                        this.error=true //MUESTRA MENSAJE
                    }
                    break;
                case 2: //BACKUPS VALIDACION
                    if (this.isValid(this.user_data.chUltiBackup) && this.isValid(this.user_data.chRegeInfoTotal)){
                        this.error=false
                        this.page += 1
                    }else{
                        this.error=true
                    }
                    break;
                case 3: // RECUPERACION DE INFORMACION VALIDACIOND
                    if (this.isValid(this.user_data.chFormatear) && this.isValid(this.user_data.cFormatear) && this.isValid(this.user_data.cantEquiposParaleloFormatear) && this.isValid(this.user_data.chRestaurar) && this.isValid(this.user_data.cRestaurar) && this.isValid(this.user_data.cantEquiposParaleloRestaurar)) {
                        this.error = false
                        this.page += 1
                    } else {
                        this.error = true
                    }
                    break;
                case 4: //RESCATE VALIDACION
                    if (this.isValid(this.user_data.cRescate)) {
                        this.error = false
                        this.page += 1
                    } else {
                        this.error = true
                    }
                    break;
                case 5: //INFORMACION DE NEGOCIO VALIDACION
                    if (this.isValid(this.user_data.porcenEquiposInfectados) && this.isValid(this.user_data.cOportunidadVentas)  && this.isValid(this.user_data.cReputacion)&& this.isValid(this.user_data.cFiltradoInfo)) {
                        this.error = false
                        this.mostrar()
                        this.create_scenarios()
                        this.mostrarEscenario('Mejor escenario');
                    } else {
                        this.error = true
                    }
                    break;
                 
              }
              setTimeout('scroll()',100);  
        },
        create_scenarios: function(){
            // Mejor Escenario
            var dict_mejor_escenario = {}
            Object.assign(dict_mejor_escenario, this.user_data);
            dict_mejor_escenario['nombre']='Mejor escenario'
            dict_mejor_escenario['decrypt_tool_exists'] = true
            dict_mejor_escenario['rescue_paid'] = 0
            dict_mejor_escenario['infected_terminals'] = 0.2
            dict_mejor_escenario['has_backup'] = true
            dict_mejor_escenario['data_is_exposed'] = false
            dict_mejor_escenario['color'] = 'primary'
            dict_mejor_escenario['total'] = 0
            this.data_scenarios.push(dict_mejor_escenario)

            // Optimista
            var dict_optimista = {}
            Object.assign(dict_optimista, this.user_data);
            dict_optimista['nombre']='Optimista'
            dict_optimista['decrypt_tool_exists'] = true
            dict_optimista['rescue_paid'] = 0
            dict_optimista['infected_terminals'] = 0.5
            dict_optimista['has_backup'] = true
            dict_optimista['data_is_exposed'] = false
            dict_optimista['color'] = 'success'
            dict_optimista['total'] = 0
            this.data_scenarios.push(dict_optimista)


            // Medio
            var dict_medio = {}
            Object.assign(dict_medio, this.user_data);
            dict_medio['nombre']='Medio'
            dict_medio['decrypt_tool_exists'] = false
            dict_medio['rescue_paid'] = 1
            dict_medio['infected_terminals'] = 0.8
            dict_medio['has_backup'] = true
            dict_medio['data_is_exposed'] = true
            dict_medio['color'] = 'info'
            dict_medio['total'] = 0
            this.data_scenarios.push(dict_medio)

            // Pesimista
            var dict_pesimista = {}
            Object.assign(dict_pesimista, this.user_data);
            dict_pesimista['nombre']='Pesimista'
            dict_pesimista['decrypt_tool_exists'] = false
            dict_pesimista['rescue_paid'] = 3
            dict_pesimista['infected_terminals'] = 0.8
            dict_pesimista['has_backup'] = true
            dict_pesimista['data_is_exposed'] = true
            dict_pesimista['color'] = 'warning'
            dict_pesimista['total'] = 0
            this.data_scenarios.push(dict_pesimista)

            // Desastroso
            var dict_desastroso = {}
            Object.assign(dict_desastroso, this.user_data);
            dict_desastroso['nombre']='Desastroso'
            dict_desastroso['decrypt_tool_exists'] = false
            dict_desastroso['rescue_paid'] = 2
            dict_desastroso['infected_terminals'] = 1
            dict_desastroso['has_backup'] = false
            dict_desastroso['data_is_exposed'] = true
            dict_desastroso['color'] = 'danger'
            dict_desastroso['total'] = 0
            this.data_scenarios.push(dict_desastroso)

            // Tacaño
            var dict_tacanio = {}
            Object.assign(dict_tacanio, this.user_data);
            dict_tacanio['nombre']='Tacaño'
            dict_tacanio['decrypt_tool_exists'] = false
            dict_tacanio['rescue_paid'] = 3
            dict_tacanio['infected_terminals'] = 1
            dict_tacanio['has_backup'] = false
            dict_tacanio['data_is_exposed'] = true
            dict_tacanio['color'] = 'secondary'
            dict_tacanio['total'] = 0
            this.data_scenarios.push(dict_tacanio)

            // otro
            var otro = {}
            Object.assign(otro, this.user_data);
            otro['nombre']='Otro'
            otro['decrypt_tool_exists'] = false
            otro['rescue_paid'] = 2
            otro['infected_terminals'] = 0.8
            otro['has_backup'] = false
            otro['data_is_exposed'] = true
            otro['color'] = 'danger'
            otro['total'] = 0
            this.data_scenarios.push(otro)

        },
        mostrarEscenario: function(nombre){
            this.nombreEscenario=nombre
            this.escenario=true
        },
        ocultaGrafico: function(){
            this.escenario=false
        },  
    }
})

function scroll(){
    var posicion= $("#app").offset().top;
    $('body,html').animate({ scrollTop:posicion-10 },1000)
}


