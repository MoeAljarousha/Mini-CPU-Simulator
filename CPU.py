import tkinter as tk
from tkinter import messagebox

# Backend: Mini CPU Simulator
class MiniCPU:
    def __init__(self):
        self.registers = {
            "ACC": 0,  # Accumulator
            "R1": 0,   # General-purpose register 1
            "R2": 0    # General-purpose register 2
        }
        self.memory = [0] * 256  # Simulated memory (256 bytes)

    def execute(self, instruction):
        try:
            parts = instruction.split()
            command = parts[0].upper()

            if command == "LOAD":
                reg, value = parts[1], int(parts[2])
                self.registers[reg] = value
            elif command == "ADD":
                reg, value = parts[1], int(parts[2])
                self.registers[reg] += value
            elif command == "STORE":
                address, reg = int(parts[1]), parts[2]
                self.memory[address] = self.registers[reg]
            elif command == "LOADM":
                reg, address = parts[1], int(parts[2])
                self.registers[reg] = self.memory[address]
            elif command == "SUB":
                reg, value = parts[1], int(parts[2])
                self.registers[reg] -= value
            else:
                return "Invalid Instruction"

            return "Executed Successfully"
        except Exception as e:
            return f"Error: {e}"

# Frontend: GUI Application
class CPUSimulatorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Mini CPU Simulator")
        self.cpu = MiniCPU()

        # Instruction Input
        self.instruction_label = tk.Label(root, text="Instruction:", font=("Arial", 14))
        self.instruction_label.grid(row=0, column=0, padx=10, pady=10)
        self.instruction_entry = tk.Entry(root, font=("Arial", 14), width=30)
        self.instruction_entry.grid(row=0, column=1, padx=10, pady=10)

        # Execute Button
        self.execute_button = tk.Button(root, text="Execute", font=("Arial", 14), command=self.execute_instruction)
        self.execute_button.grid(row=0, column=2, padx=10, pady=10)

        # Registers Display
        self.registers_label = tk.Label(root, text="Registers:", font=("Arial", 14))
        self.registers_label.grid(row=1, column=0, padx=10, pady=10)
        self.registers_display = tk.Text(root, font=("Arial", 14), width=40, height=5)
        self.registers_display.grid(row=1, column=1, columnspan=2, padx=10, pady=10)

        # Memory Display
        self.memory_label = tk.Label(root, text="Memory (0-15):", font=("Arial", 14))
        self.memory_label.grid(row=2, column=0, padx=10, pady=10)
        self.memory_display = tk.Text(root, font=("Arial", 14), width=40, height=5)
        self.memory_display.grid(row=2, column=1, columnspan=2, padx=10, pady=10)

        self.update_displays()

    def execute_instruction(self):
        instruction = self.instruction_entry.get()
        result = self.cpu.execute(instruction)
        messagebox.showinfo("Execution Result", result)
        self.update_displays()

    def update_displays(self):
        self.registers_display.delete(1.0, tk.END)
        for reg, value in self.cpu.registers.items():
            self.registers_display.insert(tk.END, f"{reg}: {value}\n")

        self.memory_display.delete(1.0, tk.END)
        for i in range(16):
            self.memory_display.insert(tk.END, f"Address {i}: {self.cpu.memory[i]}\n")

# Main Program
if __name__ == "__main__":
    root = tk.Tk()
    app = CPUSimulatorApp(root)
    root.mainloop()
