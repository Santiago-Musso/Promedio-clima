const API_KEY = 'ce555ceb6ffd48c4b7c223846220908'
const DIAS_FEBRERO  = 28
const DIAS_MARZO = 31
const AÑO_INICIO = 2010 // API comienza en 2010
const AÑO_FIN = 2022
const LUGARES = ['London','Paris','Madrid','Amsterdam','Munich','Milan','Florence','Rome','Naples','Palermo','Vienna','Brussels']


class Promedio {
    constructor(febreroTemperatura,marzoTemperatura,febreroLluvias,marzoLluvias){
        this.febreroTemperatura = febreroTemperatura
        this.marzoTemperatura = marzoTemperatura
        this.febreroLluvias = febreroLluvias
        this.marzoLluvias = marzoLluvias
    }
}
class MejoresDias {
    constructor(dia,temperatura,lluvia){
        this.dia = dia
        this.temperatura = temperatura
        this.lluvia = lluvia
    }
}

async function obtenerVariables() {
    const variables = new Array
    let dias

    for(let i = 0; i < LUGARES.length; i++){
        for(let año = AÑO_INICIO; año <= AÑO_FIN; año++){
            for(let mes = 2; mes <= 3; mes++){
                if(mes === 2){
                dias = DIAS_FEBRERO
                }else if(mes === 3){
                dias = DIAS_MARZO
                }
                for(let dia = 1; dia <= dias; dia++){
                    const respuesta = await fetch(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${LUGARES[i]}&dt=${año}-${mes}-${dia}`)
                    const json = await respuesta.json()
                    variables.push([dia,año,json.forecast.forecastday[0].day.avgtemp_c,json.forecast.forecastday[0].day.totalprecip_mm,mes,LUGARES[i]])
                }
            }
        }
    }
    return variables
}

async function calcularPromedio(){
    const resultado = await obtenerVariables()
    const promedioEuropa = new Promedio
    const promedioEuropaDias = new MejoresDias
    const mejoresDiasFebrero = []
    const mejoresDiasMarzo = []

    let contadorFebrero = 0
    let contadorMarzo = 0

    promedioEuropa.febreroTemperatura = 0
    promedioEuropa.marzoTemperatura = 0
    promedioEuropa.febreroLluvias = 0
    promedioEuropa.marzoLluvias = 0

    for(let i = 0; i < resultado.length; i++){
        if(resultado[i][4] === 2){
            promedioEuropa.febreroTemperatura += resultado[i][2]
            promedioEuropa.febreroLluvias += resultado[i][3]
            promedioEuropaDias.dia = resultado[i][0]
            promedioEuropaDias.temperatura = resultado[i][2]
            promedioEuropaDias.lluvia = resultado[i][3]

            if(contadorFebrero < DIAS_FEBRERO){
                mejoresDiasFebrero.push([promedioEuropaDias.dia,promedioEuropaDias.temperatura,promedioEuropaDias.lluvia]) 
            }else{
                mejoresDiasFebrero[promedioEuropaDias.dia - 1][1] += resultado[i][2]
                mejoresDiasFebrero[promedioEuropaDias.dia - 1][2] += resultado[i][3]
            } 
            contadorFebrero++
        }else if(resultado[i][4] === 3){
            promedioEuropa.marzoTemperatura += resultado[i][2]
            promedioEuropa.marzoLluvias += resultado[i][3]
            promedioEuropaDias.dia = resultado[i][0]
            promedioEuropaDias.temperatura = resultado[i][2]
            promedioEuropaDias.lluvia = resultado[i][3]

            if(contadorMarzo < DIAS_MARZO){
                mejoresDiasMarzo.push([promedioEuropaDias.dia,promedioEuropaDias.temperatura,promedioEuropaDias.lluvia]) 
            }else{
                mejoresDiasMarzo[promedioEuropaDias.dia - 1][1] += resultado[i][2]
                mejoresDiasMarzo[promedioEuropaDias.dia - 1][2] += resultado[i][3]
            } 
            contadorMarzo++ 
        }
    }

    promedioEuropa.febreroTemperatura = `${(promedioEuropa.febreroTemperatura/contadorFebrero).toFixed(2)}°C`
    promedioEuropa.febreroLluvias = `${(promedioEuropa.febreroLluvias/contadorFebrero).toFixed(2)}mm`
    promedioEuropa.marzoTemperatura = `${(promedioEuropa.marzoTemperatura/contadorMarzo).toFixed(2)}°C`
    promedioEuropa.marzoLluvias = `${(promedioEuropa.marzoLluvias/contadorMarzo).toFixed(2)}mm`
    
    for(let i = 0; i < mejoresDiasFebrero.length; i++){
        mejoresDiasFebrero[i][0] = `Dia: ${mejoresDiasFebrero[i][0]}`
        mejoresDiasFebrero[i][1] = `${(mejoresDiasFebrero[i][1] / ((AÑO_FIN - AÑO_INICIO + 1) * LUGARES.length)).toFixed(2)}°C`
        mejoresDiasFebrero[i][2] = `${(mejoresDiasFebrero[i][2] / ((AÑO_FIN - AÑO_INICIO + 1) * LUGARES.length)).toFixed(2)}mm`
    }

    for(let i = 0; i < mejoresDiasMarzo.length; i++){
        mejoresDiasMarzo[i][0] = `Dia: ${mejoresDiasMarzo[i][0]}`
        mejoresDiasMarzo[i][1] = `${(mejoresDiasMarzo[i][1] / ((AÑO_FIN - AÑO_INICIO + 1) * LUGARES.length)).toFixed(2)}°C`
        mejoresDiasMarzo[i][2] = `${(mejoresDiasMarzo[i][2] / ((AÑO_FIN - AÑO_INICIO + 1) * LUGARES.length)).toFixed(2)}mm`
    }

    await console.log(promedioEuropa)
    await console.log(mejoresDiasFebrero)
    await console.log(mejoresDiasMarzo)

}

calcularPromedio()
