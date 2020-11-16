import { CdkTableModule } from '@angular/cdk/table';
import { Component, Input, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WorkAllocationComponentsModule } from 'src/work-allocation/components/work-allocation.components.module';
import { WorkAllocationTaskService } from 'src/work-allocation/services/work-allocation-task.service';

import { TaskFieldType, TaskService, TaskSort, TaskView } from '../../enums';
import { Task, TaskAction, TaskFieldConfig, TaskServiceConfig, TaskSortField } from './../../models/tasks';
import { TaskListComponent } from './task-list.component';

@Component({
  template: `
    <exui-task-list [fields]='fields' [tasks]='tasks' [taskServiceConfig]="taskServiceConfig" [sortedBy]="TaskSortField"></exui-task-list>`
})
class WrapperComponent {
  @ViewChild(TaskListComponent) public appComponentRef: TaskListComponent;
  @Input() public fields: TaskFieldConfig[];
  @Input() public tasks: Task[];
  @Input() public taskServiceConfig: TaskServiceConfig;
  @Input() public sortedBy: TaskSortField;
}

/**
 * Mock tasks
 */
function getTasks(): Task[] {

  return [
    {
      id: '1549476532065586',
      caseReference: '1549 4765 3206 5586',
      caseName: 'Kili Muso',
      caseCategory: 'Protection',
      location: 'Taylor House',
      taskName: 'Review respondent evidence',
      dueDate: new Date(628021800000),
      actions: [
        {
          id: 'actionId1',
          title: 'Reassign task',
        },
        {
          id: 'actionId2',
          title: 'Release this task',
        }
      ]
    },
    {
      id: '1549476532065587',
      caseReference: '1549 4765 3206 5587',
      caseName: 'Mankai Lit',
      caseCategory: 'Revocation',
      location: 'Taylor House',
      taskName: 'Review appellant case',
      dueDate: new Date(628021800000),
      actions: [
        {
          id: 'actionId2',
          title: 'Release this task',
        }
      ]
    },
  ];
}

/**
 * Mock fields
 */
function getFields(): TaskFieldConfig[] {

  return [
    {
      name: 'caseReference',
      type: TaskFieldType.STRING,
      columnLabel: 'Case reference',
      views: TaskView.TASK_LIST,
    },
    {
      name: 'caseName',
      type: TaskFieldType.STRING,
      columnLabel: 'Case name',
      views: TaskView.TASK_LIST,
    },
    {
      name: 'caseCategory',
      type: TaskFieldType.STRING,
      columnLabel: 'Case category',
      views: TaskView.TASK_LIST,
    },
    {
      name: 'location',
      type: TaskFieldType.STRING,
      columnLabel: 'Location',
      views: TaskView.TASK_LIST,
    },
    {
      name: 'taskName',
      type: TaskFieldType.STRING,
      columnLabel: 'Task',
      views: TaskView.TASK_LIST,
    },
    {
      name: 'dueDate',
      type: TaskFieldType.STRING,
      columnLabel: 'Due Dated',
      views: TaskView.TASK_LIST,
    },
  ];
}

/**
 * Mock TaskServiceConfig.
 */
function getTaskService(): TaskServiceConfig {
  return {
    service: TaskService.IAC,
    defaultSortDirection: TaskSort.ASC,
    defaultSortFieldName: 'dueDate',
    fields: getFields(),
  };
}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  const mockWorkAllocationService = jasmine.createSpyObj('mockWorkAllocationService', ['getTask']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        WorkAllocationComponentsModule,
        CdkTableModule
      ],
      declarations: [TaskListComponent, WrapperComponent],
      providers: [{ provide: WorkAllocationTaskService, useValue: mockWorkAllocationService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;

    wrapper.tasks = getTasks();
    wrapper.fields = getFields();
    wrapper.taskServiceConfig = getTaskService();
    mockWorkAllocationService.getTask.and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should return the fields as an array with a \'manage\' entry, so that we can' +
    'display the manage column in the table.', async () => {

    const fields = ['caseReference', 'caseName', 'caseCategory', 'location', 'task', 'dueDate'];
    const fieldsWithManage = [...fields, 'manage'];

    expect(component.addManageColumn(fields)).toEqual(fieldsWithManage);
  });

  it('should return the columns to be displayed by the Angular Component Dev Kit table.', async () => {

    // create mock getDisplayedColumn variables
    const taskFieldConfig = getFields();
    const fields = taskFieldConfig.map(field => field.name);
    const displayedColumns = component.addManageColumn(fields);

    // test actual function against mock variables
    expect(component.getDisplayedColumn(taskFieldConfig)).toEqual(displayedColumns);

  });

  it('should take in the field name and trigger a new Request to the API to get a sorted result set.', async () => {

    // mock the emitter and dispatch the connected event
    spyOn(component.sortEvent, 'emit');
    const element = fixture.debugElement.nativeElement;
    const button = element.querySelector('#sort_by_caseReference');
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // check the emitter had been called and that it gets called with the first field which is caseReference
    expect(component.sortEvent.emit).toHaveBeenCalled();
    expect(component.sortEvent.emit).toHaveBeenCalledWith('caseReference');
  });

  it('should allow sorting for different columns.', async () => {

    // mock the emitter and dispatch the connected event
    spyOn(component.sortEvent, 'emit');
    let element = fixture.debugElement.nativeElement;
    let button = element.querySelector('#sort_by_caseName');
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // check the emitter had been called and that it gets called with the field defined which is caseName
    expect(component.sortEvent.emit).toHaveBeenCalled();
    expect(component.sortEvent.emit).toHaveBeenCalledWith('caseName');

    // mock the emitter and dispatch the connected event to a column to the right
    element = fixture.debugElement.nativeElement;
    button = element.querySelector('#sort_by_taskName');
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // check the emitter had been called and that it gets called with the new field defined which is taskName
    expect(component.sortEvent.emit).toHaveBeenCalled();
    expect(component.sortEvent.emit).toHaveBeenCalledWith('taskName');

    // mock the emitter and dispatch the connected event to a column to the left
    element = fixture.debugElement.nativeElement;
    button = element.querySelector('#sort_by_caseCategory');
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // check the emitter had been called and that it gets called with the new field defined which is caseCategory
    expect(component.sortEvent.emit).toHaveBeenCalled();
    expect(component.sortEvent.emit).toHaveBeenCalledWith('caseCategory');
  });

  it('should open and close the selected row.', async () => {
    const firstTaskId: string = getTasks()[0].id;
    const secondTaskId: string = getTasks()[1].id;

    // get the 'manage' button and click it
    let element = fixture.debugElement.nativeElement;
    let button = element.querySelector(`#manage_${firstTaskId}`);
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // get the selected row and confirm it is not null
    const row1 = component.getSelectedRow();
    expect(component.getSelectedRow()).not.toBe(null);

    // click the 'manage' button again and confirm that it is null
    element = fixture.debugElement.nativeElement;
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.getSelectedRow()).toBe(null);

    // click the button one last time and confirm selected and equal to earlier given row
    element = fixture.debugElement.nativeElement;
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.getSelectedRow()).not.toBe(null);
    expect(component.getSelectedRow()).toEqual(row1);
    expect(row1.id).toEqual(firstTaskId);

    // click the button for the second task
    element = fixture.debugElement.nativeElement;
    button = element.querySelector(`#manage_${secondTaskId}`);
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // get the selected row and confirm it is not null and is the secondTaskId
    const row2 = component.getSelectedRow();
    expect(component.getSelectedRow()).not.toBe(null);
    expect(row2.id).toEqual(secondTaskId);
  });

  it('should allow setting the selected row.', async () => {
    const firstTaskId: string = getTasks()[0].id;
    const secondTaskId: string = getTasks()[1].id;

    // get the 'manage' button and click it
    let element = fixture.debugElement.nativeElement;
    const button1 = element.querySelector(`#manage_${firstTaskId}`);
    const button2 = element.querySelector(`#manage_${secondTaskId}`);
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // get the selected row and confirm it is not null
    const row1 = component.getSelectedRow();
    expect(component.getSelectedRow()).not.toBe(null);

    // click the 'manage' button again and confirm that it is null
    element = fixture.debugElement.nativeElement;
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.getSelectedRow()).toBe(null);

    // set the selected row as the earlier defined row
    component.setSelectedRow(row1);
    fixture.detectChanges();
    expect(component.getSelectedRow()).not.toBe(null);
    expect(component.getSelectedRow()).toEqual(row1);
    expect(row1.id).toEqual(firstTaskId);

    // click the 'manage' button again and confirm that it is selected
    element = fixture.debugElement.nativeElement;
    button2.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    const row2 = component.getSelectedRow();
    expect(component.getSelectedRow()).not.toBe(null);

    // set the selected row as the earlier defined row
    component.setSelectedRow(row1);
    fixture.detectChanges();
    expect(component.getSelectedRow()).not.toBe(null);
    expect(component.getSelectedRow()).toEqual(row1);
    expect(row1.id).toEqual(firstTaskId);

    // set the selected row as the later defined row
    component.setSelectedRow(row2);
    fixture.detectChanges();
    expect(component.getSelectedRow()).not.toBe(null);
    expect(component.getSelectedRow()).toEqual(row2);
    expect(row2.id).toEqual(secondTaskId);

    // click selected row again and confirm null
    component.setSelectedRow(row2);
    fixture.detectChanges();
    expect(component.getSelectedRow()).toBe(null);
  });

  it('should allow checking the selected row.', async () => {
    const firstTaskId: string = getTasks()[0].id;
    const secondTaskId: string = getTasks()[1].id;

    // get the 'manage' button and click it
    let element = fixture.debugElement.nativeElement;
    const button1 = element.querySelector(`#manage_${firstTaskId}`);
    const button2 = element.querySelector(`#manage_${secondTaskId}`);
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // get the selected row and confirm it is not null
    const row1 = component.getSelectedRow();
    expect(component.getSelectedRow()).not.toBe(null);

    // expect the row to be selected
    expect(component.isRowSelected(row1)).toBeTruthy();

    // click the 'manage' button for the second row and confirm that initial row is not selected
    element = fixture.debugElement.nativeElement;
    button2.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    const row2 = component.getSelectedRow();
    expect(component.isRowSelected(row1)).toBeFalsy();
    expect(component.isRowSelected(row2)).toBeTruthy();

    // click the 'manage' button for the initial row and confirm that second row is not selected
    element = fixture.debugElement.nativeElement;
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.isRowSelected(row1)).toBeTruthy();
    expect(component.isRowSelected(row2)).toBeFalsy();

    // click the 'manage' button for the initial row and confirm that neither are selected
    element = fixture.debugElement.nativeElement;
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.isRowSelected(row1)).toBeFalsy();
    expect(component.isRowSelected(row2)).toBeFalsy();
  });

  it('should trigger an event to the parent when the User clicks on an action.', async () => {
    // set relevant variables
    const firstTask: Task = getTasks()[0];
    const secondTask: Task = getTasks()[1];
    const firstTaskId: string = firstTask.id;
    const secondTaskId: string = secondTask.id;
    const firstAction: TaskAction = getTasks()[0].actions[0];
    const secondAction: TaskAction = getTasks()[0].actions[1];
    const firstActionId: string = firstAction.id;
    const secondActionId: string = secondAction.id;


    // mock the emitter and click the first manage button
    spyOn(component.actionEvent, 'emit');
    const element = fixture.debugElement.nativeElement;
    const button1 = element.querySelector(`#manage_${firstTaskId}`);
    const button2 = element.querySelector(`#manage_${secondTaskId}`);
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // check the emitter had been called and that it gets called with the first invoked task action
    const anchor1 = element.querySelector(`#action_${firstActionId}`);
    anchor1.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.actionEvent.emit).toHaveBeenCalled();
    let task = firstTask;
    let action = firstAction;
    expect(component.actionEvent.emit).toHaveBeenCalledWith({task, action});

    // check the emitter had been called and that it gets called with the second invoked task action
    const anchor2 = element.querySelector(`#action_${secondActionId}`);
    anchor2.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.actionEvent.emit).toHaveBeenCalled();
    task = firstTask;
    action = secondAction;
    expect(component.actionEvent.emit).toHaveBeenCalledWith({task, action});

    // click the second button in order to show the last action anchor
    button2.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // check the emitter had been called and that it gets called with the third invoked task action
    const anchor3 = element.querySelector(`#action_${secondActionId}`);
    anchor3.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.actionEvent.emit).toHaveBeenCalled();
    task = secondTask;
    action = secondAction;
    expect(component.actionEvent.emit).toHaveBeenCalledWith({task, action});
  });

  it('should allow a check to verify whether column sorted.', async () => {

    // expect the column to not be sorted yet
    expect(component.isColumnSorted('caseReference')).toBe(TaskSort.NONE);
    expect(component.isColumnSorted('caseCategory')).toBe(TaskSort.NONE);

    // mock the emitter and dispatch the connected event (with example case field buttons selected)
    spyOn(component.sortEvent, 'emit');
    const element = fixture.debugElement.nativeElement;
    const button1 = element.querySelector('#sort_by_caseReference');
    const button2 = element.querySelector('#sort_by_caseCategory');
    component.setSortOrder('caseReference');
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // check the case reference is being sorted via ascending
    expect(component.sortEvent.emit).toHaveBeenCalled();
    expect(component.sortEvent.emit).toHaveBeenCalledWith('caseReference');
    expect(component.isColumnSorted('caseReference')).toBe(TaskSort.ASC);
    expect(component.isColumnSorted('caseCategory')).toBe(TaskSort.NONE);

    // check that the case reference is being sorted via descending
    component.setSortOrder('caseReference');
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.sortEvent.emit).toHaveBeenCalled();
    expect(component.sortEvent.emit).toHaveBeenCalledWith('caseReference');
    expect(component.isColumnSorted('caseReference')).toBe(TaskSort.DSC);
    expect(component.isColumnSorted('caseCategory')).toBe(TaskSort.NONE);

    // check that the case reference is not being sorted
    component.setSortOrder('caseReference');
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.sortEvent.emit).toHaveBeenCalled();
    expect(component.sortEvent.emit).toHaveBeenCalledWith('caseReference');
    expect(component.isColumnSorted('caseReference')).toBe(TaskSort.NONE);
    expect(component.isColumnSorted('caseCategory')).toBe(TaskSort.NONE);

    // click the second example button and verify that sorting is for case category
    component.setSortOrder('caseCategory');
    button2.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.sortEvent.emit).toHaveBeenCalled();
    expect(component.sortEvent.emit).toHaveBeenCalledWith('caseCategory');
    expect(component.isColumnSorted('caseReference')).toBe(TaskSort.NONE);
    expect(component.isColumnSorted('caseCategory')).toBe(TaskSort.ASC);

    // click the first example button and verify that sorting is again for case reference
    component.setSortOrder('caseReference');
    button1.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.sortEvent.emit).toHaveBeenCalled();
    expect(component.sortEvent.emit).toHaveBeenCalledWith('caseReference');
    expect(component.isColumnSorted('caseReference')).toBe(TaskSort.ASC);
    expect(component.isColumnSorted('caseCategory')).toBe(TaskSort.NONE);
  });

});
