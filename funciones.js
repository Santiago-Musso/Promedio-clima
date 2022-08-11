const API_KEY = 'ce555ceb6ffd48c4b7c223846220908'
const DIAS_FEBRERO  = 28
const DIAS_MARZO = 31
const AÑO_INICIO = 2010 // API comienza en 2010
const AÑO_FIN = 2022

const calcularPromedio = (resultado) => {
    let promedioTemperatura = 0
    let promedioLluvia = 0
    let diasMes = 0
    let mejoresDias = []

    if(resultado[0][4] === 'febrero'){
        diasMes = 28
    }else if (resultado[0][4] === 'marzo'){
        diasMes = 31
    }

    for(let i = 0; i <= ((AÑO_FIN - AÑO_INICIO)* diasMes); i += diasMes ){
        for(let j = 0; j < diasMes; j++){
            if(i === 0){
                mejoresDias.push([resultado[i+j][0],resultado[i+j][2],resultado[i+j][3]])  
            }else{
                mejoresDias[j][0] = `Dia :${resultado[i+j][0]}`
                mejoresDias[j][1] += resultado[i+j][2]
                mejoresDias[j][2] += resultado[i+j][3]
            }
        }
    }
    for(let i = 0; i < mejoresDias.length; i++){
        mejoresDias[i][1] = `${(mejoresDias[i][1] / ((AÑO_FIN - AÑO_INICIO) + 1)).toFixed(2)}°C`
        mejoresDias[i][2] = `${(mejoresDias[i][2] / ((AÑO_FIN - AÑO_INICIO) + 1)).toFixed(2)}mm`
    }

    for(let i = 0; i < resultado.length; i++){
        promedioTemperatura += parseFloat(resultado[i][2])
        promedioLluvia += parseFloat(resultado[i][3])

    }

    console.log(mejoresDias)

    promedioTemperatura = promedioTemperatura / resultado.length
    promedioLluvia = promedioLluvia / resultado.length

    return console.log(
        resultado[0][5],
        `Promedio temperatura ${resultado[0][4]}: ${promedioTemperatura.toFixed(2)}°C `,
        `Promedio de lluvias ${resultado[0][4]}: ${promedioLluvia.toFixed(2)}mm`
    )
}

async function obtenerVariables(lugar,mes) {
    const variables = new Array
    let dias
    let numeroMes

    if(mes === 'febrero'){
        dias = DIAS_FEBRERO
        numeroMes = '02'
    }else if(mes === 'marzo'){
        dias = DIAS_MARZO
        numeroMes = '03'
    }

    for(let año = AÑO_INICIO; año <= AÑO_FIN; año++){
        for(let dia = 1; dia <= dias; dia++){
            const respuesta = await fetch(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${lugar}&dt=${año}-${numeroMes}-${dia}`)
            const json = await respuesta.json()
            variables.push([dia,año,json.forecast.forecastday[0].day.avgtemp_c,json.forecast.forecastday[0].day.totalprecip_mm,mes,lugar])
        }
    }
    return variables
}

/* obtenerVariables('London','febrero')
    .then((resultado) => calcularPromedio(resultado)) */

obtenerVariables('London','marzo')
    .then((resultado) => calcularPromedio(resultado))