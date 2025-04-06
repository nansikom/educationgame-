import csv

def save_questions_to_csv(questions, filename="questions.csv"):
    with open(filename, "w", newline='', encoding="utf-8") as file:
        writer = csv.writer(file)

        # Write header row
        writer.writerow(["question", "choice_A", "choice_B", "choice_C", "choice_D", "answer"])

        # Write each question row
        for q in questions:
            row = [q["question"]] + q["choices"] + [q["answer"]]
            writer.writerow(row)
