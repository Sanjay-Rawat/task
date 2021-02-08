
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  NUMBER_OF_SHEET: number = 80;
  ROWS_IN_COACH: Array<any> = [];
  frm: FormGroup | any;
  constructor(private fb: FormBuilder) {
   
  }
  ngOnInit(): void {
    this.ROWS_IN_COACH = this.init_row(this.NUMBER_OF_SHEET);
     this.frm = this.fb.group({
      number_of_sheet: [
        '1',
        [Validators.min(1), Validators.max(7), Validators.required],
      ],
    });
  }

  /**
   * This method will return a array of array where insider array will indicated the row of the coach
   * @param number_of_sheet Total Number of Sheet in a Coach
   */
  init_row(number_of_sheet: number) {
    let row_in_coach: Array<any> = [];
    while (number_of_sheet >= 7) {
      row_in_coach.push(new Array(7));
      number_of_sheet -= 7;
    }
    let rest_sheet = number_of_sheet % 7;
    if (rest_sheet > 0) {
      row_in_coach.push(new Array(rest_sheet));
    }
    return row_in_coach;
  }

  /**
   * This method will allocates the sheet to the user as per availablity
   * @param number_of_sheet Number of sheet to be booked by user
   * @param row_in_coach  Array of rows(row in coach) that contains the data of sheet occupation
   */
  occupy_sheet(row_in_coach: Array<any> = this.ROWS_IN_COACH) {
    let number_of_sheet = this.number_of_sheet.value;
    number_of_sheet = parseInt(number_of_sheet);
    console.log(number_of_sheet);

    if (number_of_sheet > 7 || number_of_sheet < 1) {
      alert('Max 7 Sheet allowed');
      return;
    }
    let total_row = row_in_coach.length;
    let is_together = false;
    let total_available_sheet = 0;
    let i = 0;
    while (i < total_row) {
      let last_occupied_sheet = row_in_coach[i].lastIndexOf(1) + 1;
      total_available_sheet =
        total_available_sheet + row_in_coach[i].length - last_occupied_sheet;
      if (row_in_coach[i].length - last_occupied_sheet >= number_of_sheet) {
        is_together = true;
        row_in_coach[i].fill(
          1,
          last_occupied_sheet,
          last_occupied_sheet + number_of_sheet
        );
        break;
      }
      i++;
    }

    // if Sheet is not availble in a single row
    if (!is_together) {
      i = 0;
      if (number_of_sheet <= total_available_sheet) {
        while (number_of_sheet > 0) {
          let last_occupied_sheet = row_in_coach[i].lastIndexOf(1) + 1;
          let available_sheet = row_in_coach[i].length - last_occupied_sheet;
          if (available_sheet >= 1) {
            if (available_sheet < number_of_sheet) {
              row_in_coach[i].fill(
                1,
                last_occupied_sheet,
                last_occupied_sheet + available_sheet
              );
              number_of_sheet -= available_sheet;
            } else {
              row_in_coach[i].fill(
                1,
                last_occupied_sheet,
                last_occupied_sheet + number_of_sheet
              );
              number_of_sheet = 0;
              break;
            }
          }
          i++;
        }
      } else {
        alert('Sheet not Available');
      }
    }
  }

  /**
   * Getter of Number of sheet to be book by user
   */
  get number_of_sheet() {
    return this.frm.get('number_of_sheet');
  }
}
