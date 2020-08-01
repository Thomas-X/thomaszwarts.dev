extern crate console_error_panic_hook;
extern crate js_sys;
extern crate web_sys;

use std::fmt;
use std::mem;

use wasm_bindgen::prelude::*;
use web_sys::console;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}
// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn main() -> () {
    // console::log_1(&JsValue::from_f64(mem::size_of::<Cell>() as f64));
    // console::log_1(&JsValue::from_f64(get_random_arbitrary(0.0, 10.0)));
    // for i in 1..11 {
    //     console::log_1(&JsValue::from_f64(i as f64));
    // }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Cell {
    colony: ColonyNames,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ColonyNames {
    Gaia = 0,
    Aerie = 1,
    Omega = 2,
    Nova = 3,
    Terra = 4,
}

impl ColonyNames {
    fn from_usize(value: usize) -> ColonyNames {
        match value {
            0 => ColonyNames::Gaia,
            1 => ColonyNames::Aerie,
            2 => ColonyNames::Omega,
            3 => ColonyNames::Nova,
            4 => ColonyNames::Terra,
            _ => panic!("Unknown value passed for enum parsing of ColonyNames: {}", value),
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Colony {
    name: ColonyNames,
    strength: usize,
    food: usize,
}

#[wasm_bindgen]
pub struct Universe {
    width: usize,
    height: usize,
    colonies: Vec<Colony>,
    cells: Vec<Cell>,
}

pub fn get_random_arbitrary(min: f64, max: f64) -> f64 {
    js_sys::Math::random() * (max - min) + min
}

#[wasm_bindgen]
impl Universe {
    // no variadic arguments in Rust!! so this stays ugly
    fn get_index(&self, row: usize, column: usize, original_row: usize, orignal_column: usize) -> usize {
        // checking the borders, returning original row/column if true
        if row >= self.height || row < 0 {
            return (original_row * self.width + orignal_column) as usize;
        }
        if column >= self.width || column < 0 {
            return (original_row * self.width + orignal_column) as usize;
        }

        let val = (row * self.width + column) as usize;

        if val >= self.width * self.height {
            return (self.width * self.height) - 1;
        }
        val
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn height(&self) -> usize {
        self.height
    }

    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }

    pub fn new(width: usize, height: usize) -> Universe {
        console_error_panic_hook::set_once();

        let colonies: Vec<Colony> = (0..5)
            .map(|i| {
                Colony {
                    strength: match i {
                        i if i == 0 => 0,
                        _ => get_random_arbitrary(4.0, 12.0) as usize
                    },
                    food: match i {
                        i if i == 0 => 0,
                        _ => 2
                    },
                    name: match i {
                        i if i == 0 => ColonyNames::Gaia,
                        i if i == 1 => ColonyNames::Aerie,
                        i if i == 2 => ColonyNames::Omega,
                        i if i == 3 => ColonyNames::Nova,
                        i if i == 4 => ColonyNames::Terra,
                        _ => ColonyNames::Gaia,
                    },
                }
            })
            .collect();


        let mut cells: Vec<Cell> = (0..width * height)
            .map(|i| {
                Cell {
                    colony: ColonyNames::Gaia,
                }
            })
            .collect();

        // for each colony pick a random pixel
        for i in 1..5 {
            cells[get_random_arbitrary(1.0, ((width * height) - 1) as f64) as usize] = Cell {
                colony: ColonyNames::from_usize(i)
            };
        }

        Universe {
            width,
            height,
            colonies,
            cells,
        }
    }

    fn get_neighbors(&self, row: usize, col: usize) -> Vec<usize> {
        (1..5)
            .map(|i| {
                let neighbor = match i {
                    i if i == 1 => {
                        // to prevent uint underflow
                        if row == 0 {
                            return self.get_index(row, col, row, col);
                        }
                        self.get_index(row - 1, col, row, col)
                    }
                    i if i == 2 => self.get_index(row, col + 1, row, col),
                    i if i == 3 => self.get_index(row + 1, col, row, col),
                    i if i == 4 => {
                        // to prevent uint underflow
                        if col == 0 {
                            return self.get_index(row, col, row, col);
                        }
                        self.get_index(row, col - 1, row, col)
                    }
                    _ => {
                        console::log_1(&JsValue::from_str("Getting neighbours lookup error on offset"));
                        self.get_index(row, col, row, col)
                    }
                };
                neighbor
            })
            .collect()
    }

    pub fn check_if_can_subtract(value: usize, subtraction: usize) -> bool {
        value.checked_sub(subtraction) != None && value.checked_sub(subtraction) != Some(0)
    }

    pub fn tick(&mut self) {
        let mut next_cells = self.cells.clone();
        let mut next_colonies = self.colonies.clone();

        for row in 0..self.height {
            for col in 0..self.width {

                let idx = self.get_index(row, col, row, col);
                let cell = self.cells[idx];
                let neighbors = self.get_neighbors(row, col);
                let cell_colony = next_colonies[cell.colony as usize];

                if cell.colony == ColonyNames::Gaia {
                    continue;
                }
                for neighborIdx in neighbors {

                    let neighbor = next_cells[neighborIdx];
                    // enemy! (we ignore our own)
                    if neighbor.colony != cell.colony {
                        // free to duplicate, no battle only food cost
                        if neighbor.colony == ColonyNames::Gaia {
                            // random noise
                            if get_random_arbitrary(0.0, 101.0) <= 92.5 {
                                continue;
                            }
                            next_cells[neighborIdx].colony = cell.colony;
                        } else {
                            // random chance to lower colonies strength (as if by battle)
                            if get_random_arbitrary(0.0, 101.0) as usize >= 3 {
                                if get_random_arbitrary(0.0, 1010.0) as usize <= 3 {
                                    // random chance to lower colonies strength (as if by great battle)
                                    next_colonies[neighbor.colony as usize].strength = (next_colonies[neighbor.colony as usize].strength as f64 * 0.4) as usize;
                                }
                                next_colonies[neighbor.colony as usize].strength = next_colonies[neighbor.colony as usize].strength * (1 - get_random_arbitrary(0.0, 0.1) as usize);
                                continue;
                            }


                            // both sides throw 3 dice rolls
                            fn throw_dice(strength: usize) -> usize {
                                get_random_arbitrary(0.0, (5 + strength) as f64) as usize
                            }

                            let own_roll = throw_dice(cell_colony.strength) + throw_dice(cell_colony.strength) + throw_dice(cell_colony.strength);
                            // fortune favors the bold :)
                            let enemy_roll = throw_dice(next_colonies[neighbor.colony as usize].strength) + throw_dice(next_colonies[neighbor.colony as usize].strength) + throw_dice(next_colonies[neighbor.colony as usize].strength) + throw_dice(next_colonies[neighbor.colony as usize].strength);

                            // There's some crazy uint underflow issues here but the effect that I wanted
                            // has been achieved so im leaving it be.
                            // victory!
                            if own_roll > enemy_roll {
                                if Universe::check_if_can_subtract(next_colonies[neighbor.colony as usize].strength, 2) {
                                    next_colonies[neighbor.colony as usize].strength - 2;
                                }
                                next_cells[neighborIdx].colony = cell.colony;
                            } else if own_roll == enemy_roll {
                                // both sides lose
                                if Universe::check_if_can_subtract(next_colonies[neighbor.colony as usize].strength, 2) {
                                    next_colonies[neighbor.colony as usize].strength - 2;
                                }
                                if Universe::check_if_can_subtract(next_colonies[cell.colony as usize].strength, 2) {
                                    next_colonies[cell.colony as usize].strength - 2;
                                }
                            } else {
                                // we lost...
                                if Universe::check_if_can_subtract(next_colonies[cell.colony as usize].strength, 2) {
                                    next_colonies[cell.colony as usize].strength - 2;
                                }
                                next_cells[idx].colony = neighbor.colony;
                            }
                        }
                    }
                }
            }
        }

        for i in 0..next_colonies.len() {
            // next_colonies[i].strength += get_random_arbitrary(0.0, 3.0) as usize;
        }


        self.cells = next_cells;
    }
}

impl Colony {}
