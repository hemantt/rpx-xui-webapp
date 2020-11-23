import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TaskService, TaskSort } from '../../enums';
import InvokedTaskAction from '../../models/tasks/invoked-task-action.model';
import TaskServiceConfig from '../../models/tasks/task-service-config.model';
import { NavItemsModel } from './../../../app/models/nav-item.model';
import { TaskFieldType, TaskView } from './../../enums';
import { Task, TaskFieldConfig, TaskSortField } from './../../models/tasks';

@Component({
  selector: 'exui-task-home',
  templateUrl: 'task-home.component.html',
  styleUrls: ['task-home.component.scss']
})
export class TaskHomeComponent implements OnInit {

  /**
   * Take in the Router so we can determine which of the lists to show.
   */
  constructor(private readonly router: Router) {}

  /**
   * Temp Task List
   */
  public allTasks: Task[] = [
    {
      id: '1604075580956811',
      caseReference: '1604 0755 8095 6811',
      caseName: 'Kili Muso',
      caseCategory: 'Grant of representation',
      location: 'Taylor House',
      taskName: 'Apply for probate',
      dueDate: new Date(1604938789000),
      actions: [
        {
          id: 'actionId',
          title: 'Reassign task',
        },
        {
          id: 'actionId',
          title: 'Release this task',
        }
      ]
    },
    {
      id: '2345678901234567',
      caseReference: '2345 6789 0123 4567',
      caseName: 'Mankai Lit',
      caseCategory: 'Revocation',
      location: 'Taylor House',
      taskName: 'Review appellant case',
      dueDate: new Date(1604506789000),
      actions: [
        {
          id: 'actionId',
          title: 'Release this task',
        }
      ]
    },
    {
      id: '3456789012345678',
      caseReference: '3456 7890 1234 5678',
      caseName: 'Bob Cratchit',
      caseCategory: 'Protection',
      location: 'Taylor Swift',
      taskName: 'Review respondent evidence',
      dueDate: new Date(),
      actions: [
        {
          id: 'actionId',
          title: 'Reassign task',
        },
        {
          id: 'actionId',
          title: 'Release this task',
        }
      ]
    },
    {
      id: '4567890123456789',
      caseReference: '4567 8901 2345 6789',
      caseName: 'Ebenezer Scrooge',
      caseCategory: 'Revocation',
      location: 'Bleak House',
      taskName: 'Review appellant case',
      dueDate: new Date(),
      actions: [
        {
          id: 'actionId',
          title: 'Release this task',
        }
      ]
    },
    {
      id: '5678901234567890',
      caseReference: '5678 9012 3456 7890',
      caseName: 'Oliver Twist',
      caseCategory: 'Protection',
      location: 'Orphanage',
      taskName: 'Give more gruel',
      dueDate: new Date(new Date().getTime() + (86400 * 5000)),
      actions: [
        {
          id: 'actionId',
          title: 'Reassign task',
        },
        {
          id: 'actionId',
          title: 'Release this task',
        }
      ]
    },
    {
      id: '6789012345678901',
      caseReference: '6789 0123 4567 8901',
      caseName: 'David Copperfield',
      caseCategory: 'Revocation',
      location: 'Taylor House',
      taskName: 'Review appellant case',
      dueDate: new Date(1604506789000),
      actions: [
        {
          id: 'actionId',
          title: 'Release this task',
        }
      ]
    },
  ];

  public tasks: Task[] = this.allTasks.slice(0, 2);

  private readonly CASE_REFERENCE_FIELD: TaskFieldConfig = {
    name: 'caseReference',
    type: TaskFieldType.CASE_REFERENCE,
    columnLabel: 'Case reference',
    views: TaskView.TASK_LIST,
  };

  /**
   * Mock TaskFieldConfig[]
   *
   * Fields is the property of the TaskFieldConfig[], containing the configuration
   * for the fields as returned by the API.
   *
   * The sorting will handled by this component, via the
   * WP api as this component.
   */
  public fields: TaskFieldConfig[] = [
    this.CASE_REFERENCE_FIELD,
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
      type: TaskFieldType.DATE_DUE,
      columnLabel: 'Date',
      views: TaskView.TASK_LIST,
    },
  ];

  /**
   * Mock TaskServiceConfig.
   */
  public taskServiceConfig: TaskServiceConfig = {
    service: TaskService.IAC,
    defaultSortDirection: TaskSort.ASC,
    defaultSortFieldName: 'dueDate',
    fields: this.fields,
  };

  private readonly MY_TASKS: NavItemsModel = { text: 'My tasks', href: '/tasks', active: true };
  /**
   * The sub-navigation items.
   */
  public subNavigationItems: NavItemsModel[] = [
    this.MY_TASKS,
    { text: 'Available tasks', href: '/tasks/available', active: false }
  ];

  public sortedBy: TaskSortField;

  public ngOnInit(): void {
    // Set up the default sorting.
    this.sortedBy = {
      fieldName: this.taskServiceConfig.defaultSortFieldName,
      order: this.taskServiceConfig.defaultSortDirection
    };

    // Remove after integration.
    this.sortTasks();

    // Set up the active navigation item.
    this.setupActiveNavigationItem();
  }

  /**
   * We need to sort the Task List based on the fieldName.
   *
   * Following on from this function we will need to retrieve the sorted tasks from
   * the WA Api, once we have these then we need to set the tasks and fields, and pass
   * these into the TaskListComponent.
   *
   * @param fieldName - ie. 'caseName'
   */
  public onSortHandler(fieldName: string): void {

    // TODO: Remove everything below after integration.
    // This is all to prove the mechanism works.
    console.log('Task Home received Sort on:');
    console.log(fieldName);
    console.log('Faking the sort now');
    let order: TaskSort = TaskSort.ASC;
    if (this.sortedBy.fieldName === fieldName && this.sortedBy.order === TaskSort.ASC) {
      order = TaskSort.DSC;
    }
    this.sortedBy = { fieldName, order };

    // Now sort the tasks.
    this.sortTasks();
  }

  /**
   * InvokedTaskAction from the Task List Component, so that we can handle the User's
   * action.
   */
  public onActionHandler(taskAction: InvokedTaskAction): void {

    // Remove after integration
    console.log('Task Home received InvokedTaskAction:');
    console.log(taskAction.task.id);
    this.router.navigate([`/tasks/task-list/reassign/123456`]);
  }

  // Remove after integration.
  private sortTasks(): void {
    if (this.tasks && this.sortedBy) {
      this.tasks = this.tasks.sort((a: Task, b: Task) => {
        const aVal = a[this.sortedBy.fieldName];
        const bVal = b[this.sortedBy.fieldName];
        let sortVal = 0;
        if (typeof aVal === 'string') {
          sortVal = aVal.localeCompare(bVal);
        } else if (aVal instanceof Date) {
          sortVal = aVal.getTime() - new Date(bVal).getTime();
        }
        return this.sortedBy.order === TaskSort.ASC ? sortVal : -sortVal;
      });
    }
  }


  private setupActiveNavigationItem(): void {
    if (this.subNavigationItems) {
      for (const item of this.subNavigationItems) {
        item.active = item.href === this.router.url;
      }
    }
    // Set up the fields, based on the current URL.
    if (this.router.url === this.MY_TASKS.href) {
      this.CASE_REFERENCE_FIELD.type = TaskFieldType.CASE_REFERENCE;
      this.tasks = this.allTasks.slice(0, 2);
      this.sortTasks();
    } else {
      this.CASE_REFERENCE_FIELD.type = TaskFieldType.STRING;
      this.tasks = this.allTasks.slice(2);
      this.sortTasks();
    }
  }
}
