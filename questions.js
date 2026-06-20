const mockExams = {
  "mock-1": [
  {
    id: 1,
    topic: "Conceptual Framework",
    text: "Which of the following is an enhancing qualitative characteristic?",
    options: ["A. Relevance", "B. Faithful representation", "C. Comparability", "D. Materiality"],
    answer: "C",
    marks: 2
  },
  {
    id: 2,
    topic: "Conceptual Framework",
    text: "Which of the following best describes an asset?",
    options: ["A. A resource owned by an entity", "B. A present economic resource controlled by the entity as a result of past events", "C. A future economic benefit", "D. Cash owned by the entity"],
    answer: "B",
    marks: 2
  },
  {
    id: 3,
    topic: "Conceptual Framework",
    text: "Which ONE of the following is a component of faithful representation?",
    options: ["A. Timeliness", "B. Verifiability", "C. Completeness", "D. Comparability"],
    answer: "C",
    marks: 2
  },
  {
    id: 4,
    topic: "Conceptual Framework",
    text: "Which of the following statements is correct?",
    options: ["A. The Conceptual Framework overrides IFRS Standards.", "B. IFRS Standards override the Conceptual Framework.", "C. Both have equal authority.", "D. The Conceptual Framework is an IFRS Standard."],
    answer: "B",
    marks: 2
  },
  {
    id: 5,
    topic: "Conceptual Framework",
    text: "A company sells inventory to a customer and transfers control.\n\nWhat should happen to the inventory?",
    options: ["A. Continue recognising it", "B. Revalue it", "C. Derecognise it", "D. Transfer it to OCI"],
    answer: "C",
    marks: 2
  },
  {
    id: 6,
    topic: "Conceptual Framework",
    text: "Which measurement basis reflects current market conditions?",
    options: ["A. Historical Cost", "B. Current Value", "C. Accrual Basis", "D. Going Concern"],
    answer: "B",
    marks: 2
  },
  {
    id: 7,
    topic: "Conceptual Framework",
    text: "Which TWO of the following are fundamental qualitative characteristics?\n\n1. Relevance\n2. Comparability\n3. Faithful Representation\n4. Timeliness",
    options: ["A. 1 and 2", "B. 2 and 4", "C. 1 and 3", "D. 3 and 4"],
    answer: "C",
    marks: 2
  },
  {
    id: 8,
    topic: "Conceptual Framework",
    text: "An item should be recognised only if:\n\n1. It meets the definition of an element.\n2. Recognition provides useful information.",
    options: ["A. 1 only", "B. 2 only", "C. Both 1 and 2", "D. Neither"],
    answer: "C",
    marks: 2
  },
  {
    id: 9,
    topic: "Conceptual Framework",
    text: "Which of the following best describes equity?",
    options: ["A. Assets + Liabilities", "B. Assets − Liabilities", "C. Income − Expenses", "D. Assets − Expenses"],
    answer: "B",
    marks: 2
  },
  {
    id: 10,
    topic: "Conceptual Framework",
    text: "Which of the following is NOT a current value measurement basis?",
    options: ["A. Fair Value", "B. Current Cost", "C. Value in Use", "D. Present Value"],
    answer: "D",
    marks: 2
  },
  {
    id: 11,
    topic: "Conceptual Framework",
    text: "A court case exists, but the amount cannot be measured reliably.\n\nAccording to the Conceptual Framework, recognition may not be appropriate because:",
    options: ["A. Relevance fails", "B. Faithful representation may fail", "C. Prudence fails", "D. Comparability fails"],
    answer: "B",
    marks: 2
  },
  {
    id: 12,
    topic: "Conceptual Framework",
    text: "Which qualitative characteristic allows users to identify similarities and differences between entities?",
    options: ["A. Relevance", "B. Comparability", "C. Neutrality", "D. Prudence"],
    answer: "B",
    marks: 2
  },
  {
    id: 13,
    topic: "Conceptual Framework",
    text: "Which of the following is the correct definition of a liability?",
    options: ["A. Future payment expected by the entity", "B. Present obligation to transfer an economic resource as a result of past events", "C. Future economic benefit controlled by the entity", "D. Reduction in equity"],
    answer: "B",
    marks: 2
  },
  {
    id: 14,
    topic: "Conceptual Framework",
    text: "Which of the following statements about income is correct?",
    options: ["A. Income decreases equity.", "B. Income increases liabilities only.", "C. Income increases equity other than contributions from owners.", "D. Income is always cash received."],
    answer: "C",
    marks: 2
  },
  {
    id: 15,
    topic: "Conceptual Framework",
    text: "Which of the following is an example of predictive value?",
    options: ["A. Information confirming last year's estimate", "B. Information helping users forecast future cash flows", "C. Information verified by auditors", "D. Information presented clearly"],
    answer: "B",
    marks: 2
  }
  ],
  "mock-2": [
    {
      id: 1,
      topic: "IAS 16 PPE",
      text: "An entity purchased property for $6 million on 1 July 20X3. The land element of the purchase was $1 million. The expected life of the building was 50 years and its residual value nil. On 30 June 20X5 the property was revalued to $7 million, of which the land element was $1.24 million and the buildings $5.76 million. On 30 June 20X7, the property was sold for $6.8 million. What is the gain on disposal of the property that would be reported in the statement of profit or loss for the year to 30 June 20X7?",
      options: ["A. Gain $40,000", "B. Loss $200,000", "C. Gain $1,000,000", "D. Gain $1,240,000"],
      answer: "A",
      marks: 2,
      explanation: `Step 1: Building cost = 6.0m - 1.0m = 5.0m
Step 2: Depreciation before revaluation = 5.0m ÷ 50 = 0.1m. For 2 years = 0.2m
Step 3: CV before revaluation = 4.8m (Building) + 1.0m (Land) = 5.8m
Step 4: Revaluation gain = 7.0m - 5.8m = 1.2m (OCI)
Step 5: Depreciation after revaluation = 5.76m ÷ 48 years = 0.12m. For 2 years = 0.24m
Step 6: CV at disposal = 5.52m (Building) + 1.24m (Land) = 6.76m
Step 7: Gain on disposal = Sale proceeds (6.8m) - CV (6.76m) = 0.04m = $40,000`
    },
    {
      id: 2,
      topic: "IAS 16 PPE",
      text: "Tibet acquired a new office building on 1 October 20X4. Its initial carrying amount consisted of:\nLand $2,000,000\nBuilding structure $10,000,000\nAir conditioning system $4,000,000\n\nThe estimated lives of the building structure and air conditioning system are 25 years and 10 years respectively. When the air conditioning system is due for replacement, it is estimated that the old system will be dismantled and sold for $500,000. Depreciation is time-apportioned where appropriate. At what amount will the office building be shown in Tibet’s statement of financial position as at 31 March 20X5?",
      options: ["A. $15,625,000", "B. $15,250,000", "C. $15,585,000", "D. $15,600,000"],
      answer: "A",
      marks: 2,
      explanation: `Step 1: Building structure CV = 10,000 - (10,000 ÷ 25 × 6/12) = 9,800
Step 2: Air conditioning CV = 4,000 - ((4,000 - 500) ÷ 10 × 6/12) = 3,825
Step 3: Land CV = 2,000 (No depreciation)
Step 4: Total carrying amount = 2,000 + 9,800 + 3,825 = 15,625 = $15,625,000`
    },
    {
      id: 3,
      topic: "IAS 16 PPE",
      text: "The following trial balance extract relates to a property which is owned by Veeton as at 1 April 20X4:\nProperty at cost (20-year original life) $12,000,000\nAccumulated depreciation as at 1 April 20X4 $3,600,000\n\nOn 1 October 20X4, following a sustained increase in property prices, Veeton revalued its property to $10.8 million. What will be the depreciation charge in Veeton’s statement of profit or loss for the year ended 31 March 20X5?",
      options: ["A. $300,000", "B. $400,000", "C. $700,000", "D. $800,000"],
      answer: "C",
      marks: 2,
      explanation: `Step 1: Opening CV = 12,000 - 3,600 = 8,400
Step 2: Old annual depreciation = 12,000 ÷ 20 = 600
Step 3: Depreciation before revaluation (6 months) = 600 × 6/12 = 300
Step 4: CV at revaluation date = 8,400 - 300 = 8,100
Step 5: Remaining useful life = 20 - (6 + 0.5) = 13.5 years
Step 6: New annual depreciation = 10,800 ÷ 13.5 = 800
Step 7: Depreciation after revaluation (6 months) = 800 × 6/12 = 400
Step 8: Total depreciation charge = 300 + 400 = 700 = $700,000`
    },
    {
      id: 4,
      topic: "IAS 16 PPE",
      text: "Wetherby Co purchased a machine on 1 July 20X7 for $500,000. It is being depreciated on a straight-line basis over its useful life of 10 years. Residual value is estimated at $20,000. On 1 January 20X8, following a change in legislation, Wetherby Co fitted a safety guard to the machine. The safety guard cost $25,000 and has a useful life of 5 years with no residual value.\n\nWhat amount will be charged to profit or loss for the year ended 31 March 20X8 in respect of depreciation on this machine?",
      options: ["A. $36,000", "B. $37,250", "C. $41,000", "D. $48,000"],
      answer: "B",
      marks: 2,
      explanation: `Machine depreciation: (500,000 - 20,000) ÷ 10 = 48,000 per year. For 9 months (1 Jul to 31 Mar) = 36,000.
Safety guard depreciation: 25,000 ÷ 5 = 5,000 per year. For 3 months (1 Jan to 31 Mar) = 1,250.
Total depreciation charge = 36,000 + 1,250 = $37,250.`
    },
    {
      id: 5,
      topic: "IAS 16 PPE",
      text: "Auckland Co purchased a machine for $60,000 on 1 January 20X7 and determined that it had a useful life of 15 years with nil residual value. On 31 March 20X9, it was revalued to $64,000 with no change in useful life.\n\nWhat will be the depreciation charge in relation to this machine in the financial statements of Auckland Co for the year ended 31 December 20X9?",
      options: ["A. $4,000", "B. $4,765", "C. $5,020", "D. $3,765"],
      answer: "B",
      marks: 2,
      explanation: `Step 1: Annual depreciation before reval = 60,000 ÷ 15 = 4,000
Step 2: Accum depreciation to 31 Mar 20X9 (2.25 yrs) = 4,000 × 2.25 = 9,000
Step 3: CV before reval = 60,000 - 9,000 = 51,000
Step 4: Reval gain = 64,000 - 51,000 = 13,000
Step 5: Remaining useful life = 15 - 2.25 = 12.75 years
Step 6: New annual depreciation = 64,000 ÷ 12.75 = 5,019.61
Step 7: Depreciation for 20X9 = Before reval (3 months: 1,000) + After reval (9 months: 3,764.71)
Step 8: Total depreciation charge = 1,000 + 3,765 = 4,765 = $4,765`
    }
  ],
  "mock-3": [
    {
      id: 1,
      topic: "IAS 40 Investment Property",
      text: "Smithson Co purchased a new building with a 50-year life for $10 million on 1 January 20X3. On 30 June 20X5, Smithson Co moved out of the building and rented it out to third parties on a short-term lease. Smithson Co uses the fair value model for investment properties. On 30 June 20X5 the fair value of the property was $11 million and on 31 December 20X5 it was $11.5 million. What is the total net amount to be recorded in the statement of profit or loss in respect of the office for the year ended 31 December 20X5?",
      options: ["A. Net income $400,000", "B. Net income $500,000", "C. Net income $1,900,000", "D. Net income $2,000,000"],
      answer: "A",
      marks: 2,
      explanation: `Step 1: Depreciation up to transfer date (6 months) = 10,000,000 ÷ 50 × 6/12 = 100,000 expense in P&L.
Step 2: Gain on transfer to investment property = 11,000,000 - 9,500,000 CV = 1,500,000 (Recognised in OCI, ignore for P&L).
Step 3: Fair value gain after transfer (30 Jun to 31 Dec) = 11,500,000 - 11,000,000 = 500,000 income in P&L.
Step 4: Net amount in P&L = 500,000 income - 100,000 expense = $400,000 net income.`
    },
    {
      id: 2,
      topic: "IAS 40 Investment Property",
      text: "Croft acquired a building with a 40-year life for its investment potential for $8 million on 1 January 20X3. At 31 December 20X3, the fair value of the property was estimated at $9 million with costs to sell estimated at $200,000. If Croft Co uses the fair value model for investment properties, what gain should be recorded in the statement of profit or loss for the year ended 31 December 20X3?",
      options: ["A. $800,000 gain", "B. $1,000,000 gain", "C. $1,200,000 gain", "D. $0 gain"],
      answer: "B",
      marks: 2,
      explanation: `Step 1: Identify standard - acquired for investment potential = IAS 40 Fair Value Model.
Step 2: Compare opening carrying amount and closing fair value: 9,000,000 - 8,000,000 = $1,000,000 gain.
Step 3: Ignore costs to sell ($200,000). IAS 40 uses Fair Value, not Fair Value Less Costs to Sell.
Gain recognised in Profit or Loss = $1,000,000.`
    },
    {
      id: 3,
      section: "B",
      scenario: "Speculate owns two properties and uses fair value accounting where possible.\nProperty A: An office building used by Speculate for administrative purposes. At 1 April 20X2 it had a carrying amount of $2 million and a remaining life of 20 years. On 1 October 20X2, the property was let to a third party and reclassified as an investment property. The property had a fair value of $2.3 million at 1 October 20X2, and $2.34 million at 31 March 20X3.\nProperty B: Another office building let on a 12-month lease to a subsidiary of Speculate. At 1 April 20X2, it had a fair value of $1.5 million which had risen to $1.65 million at 31 March 20X3.",
      topic: "IAS 40 Investment Property",
      text: "(A) What is the correct treatment when Property A is reclassified as an investment property?",
      options: ["A. Take $350,000 gain to other comprehensive income", "B. Take $350,000 gain to the statement of profit or loss", "C. Take $400,000 gain to other comprehensive income", "D. Take $400,000 gain to the statement of profit or loss"],
      answer: "A",
      marks: 2,
      explanation: `Step 1: Find carrying amount at transfer date (1 Oct 20X2). Annual depreciation = 2,000,000 ÷ 20 = 100,000. Depr for 6 months = 50,000. CV = 2,000,000 - 50,000 = 1,950,000.
Step 2: Compare with fair value at transfer (2,300,000). Gain = 2,300,000 - 1,950,000 = $350,000.
Treatment: Accounted for as a revaluation under IAS 16, so the $350,000 gain goes to Other Comprehensive Income (OCI).`
    },
    {
      id: 4,
      section: "B",
      scenario: "Speculate owns two properties and uses fair value accounting where possible.\nProperty A: An office building used by Speculate for administrative purposes. At 1 April 20X2 it had a carrying amount of $2 million and a remaining life of 20 years. On 1 October 20X2, the property was let to a third party and reclassified as an investment property. The property had a fair value of $2.3 million at 1 October 20X2, and $2.34 million at 31 March 20X3.\nProperty B: Another office building let on a 12-month lease to a subsidiary of Speculate. At 1 April 20X2, it had a fair value of $1.5 million which had risen to $1.65 million at 31 March 20X3.",
      topic: "IAS 40 Investment Property",
      text: "(B) Which of the following models can Speculate use to account for investment properties in its individual financial statements?\n\n(i) Cost model\n(ii) Revaluation model\n(iii) Fair value model",
      options: ["A. (i) and (ii) only", "B. (i) and (iii) only", "C. (ii) and (iii) only", "D. All three"],
      answer: "B",
      marks: 2,
      explanation: `IAS 40 Investment Property allows an entity to choose between:
(i) Cost Model: Cost less accumulated depreciation and impairment (Allowed).
(iii) Fair Value Model: Measure at fair value each year with gains/losses to P&L, no depreciation (Allowed).
(ii) Revaluation Model is NOT allowed under IAS 40 (it belongs to IAS 16 PPE).
Therefore, only (i) and (iii) are permitted.`
    },
    {
      id: 5,
      topic: "IAS 40 Investment Property",
      text: "Which of the following is investment property according to IAS 40 Investment Property?",
      options: ["A. An investment in land and or buildings other than leased property", "B. A property owned and occupied by an entity for its own purposes", "C. A property which is held to earn rentals or for capital appreciation", "D. An investment in land and or buildings whether let to third parties or occupied by an entity within a group"],
      answer: "C",
      marks: 2,
      explanation: `The core definition of an investment property under IAS 40 is a property (land or a building, or part of a building, or both) held to earn rentals or for capital appreciation, or both.\n\nExam Tip: "Own purposes" (Option B) always points to IAS 16 Property, Plant and Equipment (PPE).`
    },
    {
      id: 6,
      topic: "IAS 40 Investment Property",
      text: "In accordance with IAS 40 Investment Property, which TWO of the following are classified as investment property?\n(1) Property held for long-term capital appreciation\n(2) Owner-occupied property\n(3) Land held for an undetermined future use\n(4) Property occupied by employees",
      options: ["A. (1) and (3)", "B. (2) and (4)", "C. (1) and (2)", "D. (3) and (4)"],
      answer: "A",
      marks: 2,
      explanation: `Land held for undetermined future use is explicitly classified as investment property because it is assumed to be held for capital appreciation until management decides otherwise. Owner-occupied and employee-occupied properties fall under IAS 16.`
    },
    {
      id: 7,
      topic: "IAS 40 Investment Property",
      text: "Which of the following is an investment property under IAS 40 Investment Property?",
      options: ["A. A building that is vacant but held to be rented to third parties", "B. Property under construction on behalf of third parties", "C. Property that is available for sale in the ordinary course of business", "D. Owner-occupied property"],
      answer: "A",
      marks: 2,
      explanation: `A vacant building held for a future operating lease qualifies as an investment property.\n\nRevision Point: Option B falls under IFRS 15 (Revenue), Option C is IAS 2 (Inventories), and Option D is IAS 16 (PPE).`
    },
    {
      id: 8,
      topic: "IAS 40 Investment Property",
      text: "Under IAS 40 Investment Property, which of the following transfers could result in a change from a cost model to a fair value model?\n(1) A transfer from investment property to owner-occupied property\n(2) A transfer from inventories to property available for rental\n(3) A transfer from investment property to inventories, when the property is intended for sale",
      options: ["A. 1 only", "B. 2 only", "C. 3 only", "D. 1 and 2 only"],
      answer: "B",
      marks: 2,
      explanation: `Inventories are held at the lower of cost and Net Realisable Value (NRV). If transferred to an investment property and the entity uses the fair value model for its investment properties, this results in a change from a cost basis to a fair value basis. The difference is recognized immediately in profit or loss.`
    },
    {
      id: 9,
      topic: "IAS 40 Investment Property",
      text: "Identify the correct purposes of holding investment properties in accordance with IAS 40.\n(1) For administrative purposes\n(2) For use in the supply of services\n(3) For use in the production of goods\n(4) To earn rental income\n(5) For capital appreciation",
      options: ["A. 1 and 2", "B. 2 and 3", "C. 4 and 5", "D. 1, 4 and 5"],
      answer: "C",
      marks: 2,
      explanation: `To earn rental income -> CORRECT\nFor capital appreciation -> CORRECT\n\nExplanation: Any property used for administration, supply of services, or production of goods is owner-occupied and governed by IAS 16.`
    },
    {
      id: 10,
      topic: "IAS 40 Investment Property",
      text: "Wingtip, a building company, owns a property which is currently occupied by its subsidiary. How should this property be accounted for in the CONSOLIDATED financial statements?",
      options: ["A. As investment property under IAS 40 Investment Property", "B. As inventory under IAS 2 Inventories", "C. As a lease under IFRS 16 Leases", "D. As property under IAS 16 Property, Plant and Equipment"],
      answer: "D",
      marks: 2,
      explanation: `Crucial Consolidation Rule: While the property might be an investment property in the individual financial statements of the parent, from the perspective of the group (the consolidated entity), the property is owner-occupied. Therefore, it must be treated as PPE under IAS 16 in the consolidated statements.`
    },
    {
      id: 11,
      topic: "IAS 40 Investment Property",
      text: "Which of the following could require a property to be accounted for under IAS 40 Investment Property?",
      options: ["A. The commencement of owner occupation", "B. The commencement of development with a view to sale", "C. The cessation of a lease to another party", "D. The cessation of owner occupation"],
      answer: "D",
      marks: 2,
      explanation: `When owner-occupation ceases and the property is now held to earn rentals or for capital appreciation, it must be transferred out of IAS 16 and into IAS 40.`
    },
    {
      id: 12,
      topic: "IAS 40 Investment Property",
      text: "A company ceased owner-occupation of an office building on 31 March 20X3 and let the building out to a third party. The fair value was estimated to be $0.9m. The building had originally cost $0.8m on 1 January 20X1 and has a 50-year life. At 31 December 20X3, the building had an estimated fair value of $1.1m.\n\nWhat amount should be credited to profit or loss in respect of the building at 31 December 20X3?",
      options: ["A. $136,000", "B. $200,000", "C. $300,000", "D. $336,000"],
      answer: "B",
      marks: 2,
      explanation: `Step-by-Step Calculation:\nCalculate Carrying Amount at Transfer (31 March 20X3):\n- Depreciation per year = $800,000 / 50 years = $16,000.\n- Time held as PPE (1 Jan 20X1 to 31 March 20X3) = 2.25 years (27 months).\n- Total Accumulated Depreciation = 2.25 × $16,000 = $36,000.\n- Carrying Amount = $800,000 - $36,000 = $764,000.\n\nAccount for the Transfer (IAS 16 to IAS 40):\n- Fair Value at 31 March = $900,000.\n- Revaluation Gain = $900,000 - $764,000 = $136,000.\nImportant: Under standard transfer rules, this initial uplift is treated as an IAS 16 revaluation and goes to Other Comprehensive Income (OCI) / Revaluation Surplus, not P&L.\n\nCalculate Year-End Fair Value Movement (IAS 40):\nFair Value at 31 Dec = $1,100,000.\nGain since transfer = $1,100,000 - $900,000 = $200,000.\nUnder the IAS 40 Fair Value model, subsequent changes in fair value go directly to Profit or Loss (P&L).`
    },
    {
      id: 13,
      topic: "IAS 40 Investment Property",
      text: "An investment property under IAS 40 can be held for which of the following purposes?",
      options: ["A. For use as an office", "B. For use as retail premises", "C. For use in the supply of services", "D. For capital appreciation"],
      answer: "D",
      marks: 2,
      explanation: `Capital appreciation is a primary criterion for IAS 40. The other options involve active use by the entity, placing them under IAS 16.`
    },
    {
      id: 14,
      topic: "IAS 40 Investment Property",
      text: "If the fair value of an investment property cannot be reliably measured, how should it be recognised?",
      options: ["A. At an estimated amount under IAS 40", "B. At value in use", "C. At cost less depreciation under IAS 16", "D. At estimated replacement cost"],
      answer: "C",
      marks: 2,
      explanation: `In exceptional cases where an entity adopts the fair value model but the fair value of a specific investment property cannot be measured reliably, IAS 40 dictates that the entity must measure that specific property using the cost model in IAS 16 until disposal.`
    }
  ],
  "mock-4": [
    {
      id: 1,
      type: "cr",
      topic: "Constructed Response (Section C)",
      text: "Delta, a listed entity with several subsidiaries, is preparing its financial statements for the year ended 30 June 20X3.\n\nThe following exhibits, available on the left-hand side of the screen, provide information relevant to the question:\n1. Customer contract - information relating to a contract to construct a manufacturing facility for customer C.\n2. Share portfolio - information relating to a share portfolio of a subsidiary acquired during the accounting period.\n3. Ethics - details of potential ethical issues for a trainee accountant.\n\nThis information should be used to answer the question requirements within your chosen response option(s).",
      exhibits: [
        {
          title: "1. Customer contract",
          content: "<p>Delta entered into a contract to construct a specialised manufacturing facility for Customer C on 1 January 20X3. The total contract price is $10 million. Delta has incurred costs of $2 million up to 30 June 20X3.</p><p>Delta estimates that the total costs to complete the contract will be $6 million.</p>"
        },
        {
          title: "2. Share portfolio",
          content: "<p>On 1 January 20X3, Delta acquired a 100% subsidiary. The subsidiary holds a portfolio of equity investments with a fair value of $5 million at acquisition. These are held for trading.</p>"
        },
        {
          title: "3. Ethics",
          content: "<p>A trainee accountant has been asked to record the construction contract revenue fully in the current year to ensure the manager receives a bonus.</p>"
        }
      ],
      requirements: [
        {
          title: "Requirements (25 marks)",
          content: "<p><strong>(a)</strong> Explain the accounting treatment of the customer contract in the financial statements of Delta for the year ended 30 June 20X3. (10 marks)</p><p><strong>(b)</strong> Explain the accounting treatment of the share portfolio. (5 marks)</p><p><strong>(c)</strong> Discuss the ethical issues raised. (10 marks)</p>"
        }
      ],
      responseOptions: ["word", "spreadsheet"],
      marks: 25
    }
  ]
};
