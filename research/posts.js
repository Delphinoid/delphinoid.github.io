const POST_ID_PREFIX = "research_";
const POST_URL_PREFIX = "./research/";

// Array of tags for each post, stored from newest to oldest. The last tag is the post ID.
const POSTS = [
	["2026/01/21", "algebras", "bimodules", "birepresentations", "categorical", "categories", "category", "computational", "computer", "decompositions", "idempotents", "indecomposables", "lusztig", "magma", "modules", "monoidal", "primitive", "soergel", "theory", "vogan", "17"],
	["2024/11/20", "algebras", "categories", "classification", "cuntz", "endomorphisms", "fusion", "group", "haagerup", "izumi", "leavitt", "near", "path", "quadratic", "subfactors", "16"],
	["2024/10/27", "algebras", "categories", "classification", "cuntz", "endomorphisms", "fusion", "group", "haagerup", "izumi", "leavitt", "near", "path", "quadratic", "subfactors", "15"],
	["2025/08/11", "admissible", "algebraic", "algebras", "birepresentations", "categorical", "categories", "category", "categorification", "groups", "kazhdan", "lusztig", "modules", "polynomial", "real", "reductive", "representations", "slides", "talks", "theory", "vogan", "unsw", "14"],
	["2025/07/24", "algebras", "compact", "complex", "forms", "g_2", "g2", "groups", "lie", "real", "simple", "split", "type", "13"],
	["2025/06/12", "(g, k)-modules", "admissible", "groups", "harish-chandra", "irreducible", "kazhdan", "lusztig", "modules", "real", "reductive", "representations", "vogan", "w-graphs", "12"],
	["2025/05/08", "a_1", "a_2", "a1", "a2", "bimodules", "indecomposable", "soergel", "type", "11"],
	["2025/04/07", "algebras", "amenable", "amenability", "analysis", "asymptotic", "automata", "banach", "cellular", "decomposition", "ergodic", "group", "hausdorff", "homological", "neumann", "operator", "paradoxical", "slides", "talks", "tarski", "theory", "unsw", "von", "10"],
	["2025/02/28", "admissible", "algebraic", "algebras", "birepresentations", "categorical", "categories", "category", "categorification", "groups", "kazhdan", "lusztig", "modules", "polynomial", "real", "reductive", "representations", "slides", "talks", "vogan", "unsw", "9"],
	["2024/12/05", "algebras", "birepresentations", "categorical", "categories", "category", "categorification", "cohomology", "homology", "jones", "khovanov", "modules", "monoidal", "polynomial", "representations", "slides", "talks", "wsu", "8"],
	["2024/06/18", "algebras", "bimodules", "birepresentations", "categorical", "categories", "category", "cell", "holder", "hölder", "jordan", "lusztig", "modules", "monoidal", "representations", "soergel", "talks", "theory", "vogan", "7"],
	["2024/05/01", "algebras", "birepresentations", "categories", "category", "modules", "monoidal", "representations", "subfactors", "tensor", "6"],
	["2024/05/01", "algebras", "birepresentations", "categories", "category", "modules", "monoidal", "representations", "slides", "subfactors", "talks", "tensor", "5"],
	["2023/11/16", "algebras", "arnaud", "brothier", "category", "conformal", "groups", "honours", "jones", "monoidal", "operad", "operator", "planar", "quantum", "richard", "subfactors", "thompson", "unsw", "vaughan", "4"],
	["2023/11/14", "algebras", "arnaud", "brothier", "category", "conformal", "groups", "honours", "jones", "monoidal", "operad", "operator", "planar", "presentation", "quantum", "richard", "slides", "subfactors", "talks", "thompson", "unsw", "vaughan", "3"],
	["2022/02/25", "algebras", "amsi", "arnaud", "brothier", "C*", "discrete", "groups", "operator", "research", "scholarship", "vacation", "vrs", "2"],
	["2022/02/07", "algebras", "amsi", "arnaud", "brothier", "C*", "discrete", "groups", "operator", "presentation", "research", "scholarship", "slides", "talks", "vacation", "vrs", "1"],
	["2021/12/19", "algebras", "C*", "discrete", "groups", "operator", "spectral", "0"]
];