"use client";
import { useState } from "react";
import Head from "next/head";

export default function VasoactiveDrugCalculator() {
  // Estados
  const [weight, setWeight] = useState<string>("");
  const [desiredDose, setDesiredDose] = useState<string>("");
  const [concentration, setConcentration] = useState<string>("");
  const [selectedMedication, setSelectedMedication] = useState<string>("");
  const [doseUnit, setDoseUnit] = useState<string>("mcg/kg/min");
  const [concentrationUnit, setConcentrationUnit] = useState<string>("mcg/mL");
  const [results, setResults] = useState<string[] | null>(null);
  const [medicationCategory, setMedicationCategory] = useState<
    "vasoativas" | "sedoanalgesia"
  >("vasoativas");
  const [useCustomConcentration, setUseCustomConcentration] = useState(false);

  // Constantes
  const doseUnits = [
    { value: "mcg/kg/min", label: "mcg/kg/min" },
    { value: "mg/kg/min", label: "mg/kg/min" },
    { value: "mcg/kg/h", label: "mcg/kg/h" },
    { value: "mg/kg/h", label: "mg/kg/h" },
  ];

  const concentrationUnits = [
    { value: "mcg/mL", label: "mcg/mL" },
    { value: "mg/mL", label: "mg/mL" },
  ];

  const allMedications = {
    vasoativas: [
      { value: "Noradrenalina", label: "Noradrenalina" },
      { value: "Adrenalina", label: "Adrenalina" },
      { value: "Dopamina", label: "Dopamina" },
      { value: "Dobutamina", label: "Dobutamina" },
      { value: "Milrinona", label: "Milrinona" },
      { value: "OutraVasoativa", label: "Outra vasoativa" },
    ],
    sedoanalgesia: [
      { value: "Fentanil", label: "Fentanil" },
      { value: "Midazolam", label: "Midazolam" },
      { value: "Dexmedetomidina", label: "Dexmedetomidina" },
      { value: "Cetamina", label: "Cetamina" },
      { value: "Propofol", label: "Propofol" },
      { value: "Morfina", label: "Morfina" },
      { value: "OutraSedacao", label: "Outra sedoanalgesia" },
    ],
  };

  const medicationPresentations = {
    // Drogas vasoativas
    Adrenalina: [
      { value: "1", label: "1 mg/mL (Amp. 1 mL)" },
      { value: "custom", label: "Outra concentração" },
    ],
    Noradrenalina: [
      { value: "1", label: "1 mg/mL (Amp. 4 mL)" },
      { value: "custom", label: "Outra concentração" },
    ],
    Milrinona: [
      { value: "1", label: "1 mg/mL (Amp. 10 mL)" },
      { value: "custom", label: "Outra concentração" },
    ],
    Dobutamina: [
      { value: "12,5", label: "12,5 mg/mL (Amp. 20 mL)" },
      { value: "custom", label: "Outra concentração" },
    ],
    Dopamina: [
      { value: "5", label: "5 mg/mL (Amp. 10 mL" },
      { value: "40", label: "40 mg/mL" },
      { value: "custom", label: "Outra concentração" },
    ],
    // Sedoanalgesia
    Fentanil: [
      { value: "50", label: "50 mcg/mL (Amp. 10 mL)" },
      { value: "custom", label: "Outra concentração" },
    ],
    Midazolam: [
      { value: "5", label: "5 mg/mL (Amp. 3 mL ou 10 mL)" },
      { value: "custom", label: "Outra concentração" },
    ],
    Precedex: [
      { value: "100", label: "100 mcg/mL (Amp. 2 mL)" },
      { value: "4", label: "4 mcg/mL (Diluição padrão: 2 mL + 48 mL SF0,9%)" },
      { value: "custom", label: "Outra concentração" },
    ],
    Cetamina: [
      { value: "50", label: "50 mg/mL (Amp. 2 mL ou 10 mL)" },
      { value: "custom", label: "Outra concentração" },
    ],
    Propofol: [
      { value: "10", label: "10 mg/mL (Amp. 20 mL)" },
      { value: "custom", label: "Outra concentração" },
    ],
    Morfina: [
      { value: "10", label: "10 mg/mL" },
      { value: "1", label: "1 mg/mL" },
      { value: "custom", label: "Outra concentração" },
    ],
    default: [{ value: "custom", label: "Definir concentração" }],
  };

  // Funções
  const getCurrentConcentration = () => {
    if (concentration) return concentration;
    if (!selectedMedication) return "";

    const presentations =
      medicationPresentations[selectedMedication] ||
      medicationPresentations.default;
    return presentations[0].value !== "custom" ? presentations[0].value : "";
  };

  const validateInputs = () => {
    if (!weight || !desiredDose || !selectedMedication) {
      alert("Por favor, preencha todos os campos");
      return false;
    }

    const currentConcentration = getCurrentConcentration();
    if (
      !currentConcentration ||
      isNaN(parseFloat(currentConcentration)) ||
      parseFloat(currentConcentration) <= 0
    ) {
      alert("Concentração inválida");
      return false;
    }

    if (isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      alert("Peso inválido");
      return false;
    }

    if (isNaN(parseFloat(desiredDose)) || parseFloat(desiredDose) <= 0) {
      alert("Dose desejada inválida");
      return false;
    }

    return true;
  };

  const calculateDose = () => {
    if (!validateInputs()) return;

    const weightNum = parseFloat(weight);
    const desiredDoseNum = parseFloat(desiredDose);
    const concentrationNum = parseFloat(getCurrentConcentration());

    const timeFactor = doseUnit.includes("/min") ? 24 * 60 : 24;

    const doseInMcg =
      doseUnit.includes("mg") && !concentrationUnit.includes("mcg")
        ? desiredDoseNum * 1000
        : desiredDoseNum;

    const concentrationInMcgMl =
      concentrationUnit === "mg/mL" && !doseUnit.includes("mcg")
        ? concentrationNum * 1000
        : concentrationNum;

    // Cálculo do volume total
    const totalVolumeMl =
      (doseInMcg * weightNum * timeFactor) / concentrationInMcgMl;
    const roundedVolume = Math.round(totalVolumeMl);

    // Cálculo do módulo da subtração
    const moduloSubtracao = Math.abs(roundedVolume - 24);

    // Cálculo da relação 1 mL/h
    const dosePorMlH =
      (roundedVolume * concentrationNum) / (weightNum * timeFactor);
    const roundedDosePorMlH = dosePorMlH.toFixed(4);

    // Atualização dos estados de resultado
    setResults([
      `Volume total: ${roundedVolume} mL (arredondado)`,
      `+ ${moduloSubtracao} mL de SF 0,9%`,
      `1 mL/h = ${roundedDosePorMlH} ${doseUnit}`,
    ]);
  };

  const clearFields = () => {
    setWeight("");
    setDesiredDose("");
    setConcentration("");
    setSelectedMedication("");
    setUseCustomConcentration(false);
    setResults(null);
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Calculadora de Medicamentos ICU</title>
        <meta
          name="description"
          content="Calculadora de doses para terapia intensiva"
        />
      </Head>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Calculadora de Medicamentos ICU
            </h1>
            <p className="mt-2 text-gray-600">
              Calcule o volume total necessário para 24 horas
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Peso do paciente (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: 70"
                step="0.1"
                min="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria de medicação
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    checked={medicationCategory === "vasoativas"}
                    onChange={() => {
                      setMedicationCategory("vasoativas");
                      setSelectedMedication("");
                    }}
                  />
                  <span className="ml-2 text-gray-700">Drogas Vasoativas</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    checked={medicationCategory === "sedoanalgesia"}
                    onChange={() => {
                      setMedicationCategory("sedoanalgesia");
                      setSelectedMedication("");
                    }}
                  />
                  <span className="ml-2 text-gray-700">Sedoanalgesia</span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="medication"
                className="block text-sm font-medium text-gray-700"
              >
                Medicação
              </label>
              <select
                id="medication"
                value={selectedMedication}
                onChange={(e) => {
                  setSelectedMedication(e.target.value);
                  if (
                    e.target.value &&
                    medicationPresentations[e.target.value]
                  ) {
                    const defaultPresentation =
                      medicationPresentations[e.target.value][0];
                    if (defaultPresentation.value !== "custom") {
                      setConcentration(defaultPresentation.value);
                      setConcentrationUnit(
                        defaultPresentation.value.includes(".")
                          ? "mg/mL"
                          : "mcg/mL"
                      );
                      setUseCustomConcentration(false);
                    }
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecione uma medicação</option>
                {allMedications[medicationCategory].map((med) => (
                  <option key={med.value} value={med.value}>
                    {med.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="desiredDose"
                className="block text-sm font-medium text-gray-700"
              >
                Dose desejada
              </label>
              <div className="flex mt-1">
                <input
                  type="number"
                  id="desiredDose"
                  value={desiredDose}
                  onChange={(e) => setDesiredDose(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: 0.1"
                  step="0.01"
                  min="0.01"
                />
                <select
                  value={doseUnit}
                  onChange={(e) => setDoseUnit(e.target.value)}
                  className="border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {doseUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="presentation"
                className="block text-sm font-medium text-gray-700"
              >
                Dose apresentação
              </label>
              {!useCustomConcentration ? (
                <select
                  id="presentation"
                  value={getCurrentConcentration()}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setUseCustomConcentration(true);
                      setConcentration("");
                    } else {
                      setConcentration(e.target.value);
                      setConcentrationUnit(
                        e.target.value.includes(".") ? "mg/mL" : "mcg/mL"
                      );
                    }
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {selectedMedication ? (
                    (
                      medicationPresentations[selectedMedication] ||
                      medicationPresentations.default
                    ).map((pres) => (
                      <option key={pres.value} value={pres.value}>
                        {pres.label}
                      </option>
                    ))
                  ) : (
                    <option value="">Selecione uma medicação primeiro</option>
                  )}
                </select>
              ) : (
                <>
                  <div className="flex mt-1">
                    <input
                      type="number"
                      id="concentration"
                      value={concentration}
                      onChange={(e) => setConcentration(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Digite a concentração"
                      step="0.01"
                      min="0.01"
                    />
                    <select
                      value={concentrationUnit}
                      onChange={(e) => setConcentrationUnit(e.target.value)}
                      className="border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {concentrationUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setUseCustomConcentration(false);
                      setConcentration("");
                    }}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    ← Voltar para apresentações padrão
                  </button>
                </>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={calculateDose}
                className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Calcular
              </button>
              <button
                onClick={clearFields}
                className="flex-1 bg-gray-200 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Limpar
              </button>
            </div>

            {results && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md space-y-2">
                {results.map((result, index) => (
                  <p key={index} className="text-blue-800 font-medium">
                    {result}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-6 text-xs text-gray-500">
              <p>
                <strong>Fórmula:</strong> (dose × peso × tempo) / concentração
              </p>
              <p className="mt-1">
                <strong>Tempo:</strong> 24×60 para mcg/kg/min ou mg/kg/min | 24
                para mcg/kg/h ou mg/kg/h
              </p>
              <p className="mt-2">
                <strong>Nota:</strong> Esta calculadora é apenas para fins
                educacionais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
