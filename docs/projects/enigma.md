# Enigma Cipher

<div style="display: flex; justify-content: center">
<table>
    <tr>{{ get_table_headers("project") }}</tr>
    <tr>{{ load_project_table_data("Enigma Cipher") }}</tr>
</table>
</div>

The [**Enigma Machine**](https://en.wikipedia.org/wiki/Enigma_machine) is a very well known cipher that was used in WWII.
Its purpose was to serve as a bidirectional message cipher (encoding and decoding) with a specific configuration.
This project encapsulated 

## Motivation

The project displayed here had the **simple goal** of bringing this ciphering functionality with an OOP structure and defining a very modular Python package.
Along with the package creation, the project contains proper documentation for every module.

!!! Important
    At last, the whole project was coded without following any guide nor tutorial.
    All required information was obtained by reading and understanding about the authentic enigma machine.

## Project Road

The `enigma-cipher` Python package differs from the others in its modularity.
All other projects seem to recreate the exact enigma machine, while this project takes how it worked and expands it to a very custom setup.

### Understanding the machine

The key point to understand the ciphering is that every pair of letters is always paired at a certain state.
Assuming a frozen state, pressing any key will always return its paired key.
Considering the first state of the next image, it can be seen that 'A' will always return 'G' (for this configuration) and 'G' will always return 'A'.
This is the main reason why the tool works as both encoder and decoder for any message, as for decoding it the machine just needs to be at the same initial state and provide as input the encoded message.

<img src="https://raw.githubusercontent.com/Jtachan/enigma_cipher/refs/heads/main/docs/files/Enigma-action.svg" alt="Diagram of the enigma machine with two states: the first state displays how pressing an A returns a G; the second, how pressing an A (after the rotor advanced) returns a C">

The machine is then composed by three unique parts:

- The **PlugBoard**, which defines an initial mapping among letters that affects at the first input. Thus, if 'A' if connected to 'F', when the key 'A' is pressed the input received by the first rotor is 'F'. If a letter is not connected to any other and it is pressed, the same letter is provided as the input for the first rotor. 
- The **Rotors**, which provide an N-shift letter ciphering, where N is the rotor index position from 0 to 25 (all letters). When N=0, if the letter 'A' is provided the rotor returns 'A', but if N=5 the same 'A' input provides 'F' to the next step.
- The **Reflector**, which is analogous to the plugboard but with the difference that here all letters are mapped to each other, so no letter can be without any pair. This piece was also always static and its configuration could not be changed.

### The machine as code

WIP
