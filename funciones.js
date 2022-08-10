const API_KEY = 'ce555ceb6ffd48c4b7c223846220908'
const DIAS_FEBRERO  = 28
const DIAS_MARZO = 31
const AÑO_FIN = 2011

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

    for(let i = 1; i <= (AÑO_FIN - 2010); i += diasMes ){
        for(let j = 0; j < diasMes; j++){
            console.log(i+j)
            mejoresDias[j] += resultado[i+j]
        }
    }

    console.log(mejoresDias)
    console.log(resultado)

    for(let i = 0; i < resultado.length; i++){
        promedioTemperatura += parseFloat(resultado[i][2])
        promedioLluvia += parseFloat(resultado[i][3])

    }

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

    if(mes === 'febrero'){
        dias = DIAS_FEBRERO
    }else if(mes === 'marzo'){
        dias = DIAS_MARZO
    }

    for(let año = 2010; año <= AÑO_FIN; año++){
        for(let dia = 1; dia <= dias; dia++){
            const respuesta = await fetch(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${lugar}&dt=${año}-02-${dia}`)
            const json = await respuesta.json()
            variables.push([dia,año,json.forecast.forecastday[0].day.avgtemp_c,json.forecast.forecastday[0].day.totalprecip_mm,mes,lugar])
        }
    }
    return variables
}

obtenerVariables('London','febrero')
    .then((resultado) => calcularPromedio(resultado))