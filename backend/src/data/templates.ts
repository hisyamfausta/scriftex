export interface LatexTemplate {
  id: string
  name: string
  source: string
}

const BLANK = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}

\\title{Untitled Document}
\\author{}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

Your content here.

\\end{document}`

const BUSINESS_SPEC = `\\documentclass{report}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\title{Business / Functional Specification}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle
\\tableofcontents
\\newpage

\\chapter{Introduction}
\\section{Purpose}
Describe the purpose of this document and the project.

\\section{Scope}
Define the scope of the project — what is included and what is out of scope.

\\section{Definitions and Acronyms}
\\begin{itemize}
  \\item \\textbf{Term} — Definition
\\end{itemize}

\\chapter{Functional Requirements}
\\section{User Stories}
\\begin{itemize}
  \\item As a [user], I want to [action] so that [benefit].
\\end{itemize}

\\section{Functional Specifications}
Detail the functional behavior of the system.

\\chapter{Non-Functional Requirements}
\\section{Performance}
Performance criteria and benchmarks.

\\section{Security}
Security requirements and compliance.

\\chapter{Technical Architecture}
High-level technical approach and system design.

\\chapter{Acceptance Criteria}
Conditions that must be met for delivery.

\\end{document}`

const SCIENTIFIC_PAPER = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{geometry}

\\title{Title of the Paper}
\\author{Author Name\\\\Institution\\\\Email@example.com}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
A concise summary of the paper covering the problem, approach, key results, and conclusions.
\\end{abstract}

\\section{Introduction}
Background, motivation, and contributions of this work. Review related literature and state the research gap.

\\section{Methodology}
\\subsection{Experimental Setup}
Describe the experimental environment, datasets, and tools used.

\\subsection{Procedure}
Step-by-step description of the methodology.

\\section{Results}
\\begin{table}[h]
\\centering
\\begin{tabular}{|l|c|c|}
\\hline
\\textbf{Metric} & \\textbf{Value} & \\textbf{Baseline} \\\\
\\hline
Accuracy & 0.00 & 0.00 \\\\
Precision & 0.00 & 0.00 \\\\
Recall & 0.00 & 0.00 \\\\
\\hline
\\end{tabular}
\\caption{Experimental results compared to baseline.}
\\label{tab:results}
\\end{table}

\\section{Discussion}
Interpretation of results, limitations, and future work.

\\section{Conclusion}
Summary of findings and their implications.

\\begin{thebibliography}{9}
\\bibitem{ref1} Author, Title, Journal, Year.
\\end{thebibliography}

\\end{document}`

const ATS_RESUME = `\\documentclass{scrartcl}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{hyperref}
\\usepackage{geometry}

\\geometry{margin=1in}

\\pagestyle{empty}

\\begin{document}

\\begin{center}
\\huge \\textbf{Full Name} \\\\[4pt]
\\normalsize
City, State \\textbar{} Phone Number \\textbar{} Email@example.com \\\\
\\href{https://linkedin.com/in/username}{LinkedIn} \\textbar{}
\\href{https://github.com/username}{GitHub}
\\end{center}

\\section*{Professional Summary}
Highly motivated professional with experience in [field]. Proven track record in [key achievement]. Skilled in [skills summary].

\\section*{Skills}
\\begin{itemize}
  \\item \\textbf{Languages:} Python, JavaScript, TypeScript
  \\item \\textbf{Frameworks:} React, Node.js, Django
  \\item \\textbf{Tools:} Docker, Git, CI/CD
  \\item \\textbf{Databases:} PostgreSQL, SQLite
\\end{itemize}

\\section*{Experience}
\\subsection*{Company Name | City, State}
\\textit{Job Title | Month Year -- Present}
\\begin{itemize}
  \\item Accomplishment with measurable impact.
  \\item Key responsibility handled effectively.
  \\item Project delivered on time and under budget.
\\end{itemize}

\\subsection*{Previous Company | City, State}
\\textit{Job Title | Month Year -- Month Year}
\\begin{itemize}
  \\item Achieved [result] by implementing [solution].
  \\item Led team of [size] to deliver [project].
\\end{itemize}

\\section*{Education}
\\subsection*{Degree Name}
University Name, City \\hfill Year -- Year
\\begin{itemize}
  \\item Relevant coursework or honors.
\\end{itemize}

\\section*{Certifications}
\\begin{itemize}
  \\item Certification Name, Issuing Organization
\\end{itemize}

\\end{document}`

export const TEMPLATES: LatexTemplate[] = [
  { id: 'blank', name: 'Blank Document', source: BLANK },
  { id: 'business-spec', name: 'Business / Functional Specification', source: BUSINESS_SPEC },
  { id: 'scientific-paper', name: 'Scientific Paper', source: SCIENTIFIC_PAPER },
  { id: 'ats-resume', name: 'ATS Resume', source: ATS_RESUME },
]
