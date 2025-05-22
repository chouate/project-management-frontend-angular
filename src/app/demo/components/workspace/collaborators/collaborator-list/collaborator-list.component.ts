import {Component, OnInit} from '@angular/core';
import {MessageService, SelectItem} from "primeng/api";
import {DataView} from "primeng/dataview";
import {User} from "../../../../api/user";
import {UserService} from "../../../../service/user.service";
import {TechnologyService} from "../../../../service/technology.service";
import {AuthService} from "../../../../service/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-collaborator-list',
    templateUrl: './collaborator-list.component.html',
    styleUrls: ['./collaborator-list.component.scss'],
    providers: [MessageService]
})
export class CollaboratorListComponent implements OnInit{
    currentUserRole: string;

    collaborators: User[] = [];
    filteredCollaborators: User[] = [];

    roleOptions: SelectItem[] = [
        { label: 'Director', value: 'DIRECTOR' },
        { label: 'Project Manager', value: 'PROJECT_MANAGER' },
        { label: 'Developer', value: 'DEVELOPER' },
        { label: 'All Roles', value: '' }
    ];

    filterByOptions: SelectItem[] = [
        { label: 'First Name & Last Name', value: 'name' },
        { label: 'Email', value: 'email' }
    ];

    selectedRole: string = '';  // Selected role
    selectedFilterOption: string = '';  // Selected filtering option (by name or email)
    searchQuery: string = '';  // Search by name or email


    sortOrder: number = 0;
    sortField: string = '';

    /*
    start attributes to manage skills
     */
    displayCompetencesDialog: boolean = false;
    selectedTechnologies: any[] = [];
    allTechnologies: SelectItem[] = []; // List of available technologies
    collaboratorToManage: User = {} // To retrieve the collaborator to manage their skills
    /*
    end attributes to manage skills
     */

    constructor(
        private userService: UserService,
        private technologyService : TechnologyService,
        private messageService: MessageService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        // this.userService.getCollaborators().then(data => {
        //         this.collaborators = data;
        //         this.filteredCollaborators = [...this.collaborators];
        //     }
        // );
        this.currentUserRole = this.authService.getUserRole();

        console.log("The current user is : " +this.authService.currentUser$)
        console.log(this.authService.currentUser$)

        this.userService.getCollabrators().subscribe({
            next: (data: User[]) => {
                this.collaborators = data;
                this.filteredCollaborators = [...data];
                console.log('collaborators:', this.collaborators);
                console.log('filteredCollaborators:', this.filteredCollaborators);
            },
            error: err => {
                console.error('An error occurred while loading collaborators', err);
            }
        });

        this.selectedFilterOption = 'name';


        // Initialisation avec des données mockées
        // this.allTechnologies = [
        //     { label: 'JavaScript', value: { name: 'JavaScript', description: 'A powerful programming language for web development' } },
        //     { label: 'Python', value: { name: 'Python', description: 'A versatile language for general purpose programming' } },
        //     { label: 'JAVA', value: { name: 'JAVA', description: 'A high-performance language for enterprise applications' } },
        //     { label: 'Angular', value: { name: 'Angular', description: 'A web framework for building modern applications' } },
        //     { label: 'C++', value: { name: 'C++', description: 'A JavaScript library for building user interfaces' } },
        //     { label: 'PLSQL', value: { name: 'PLSQL', description: 'description for PLSQL' } }
        // ];

        // Dynamic loading of technologies
        this.technologyService.getTechnologies().subscribe(techs => {
            // Convert each Technology into a SelectItem
            this.allTechnologies = techs.map(t => ({
                label: t.name,
                value: t
            }));
        });
    }

    /*
    start logique to filter
     */
    // Filtering based on role and search field
    onFilterChange() {
        let filteredData = this.collaborators;

        // Filter by role
        if (this.selectedRole) {
            filteredData = filteredData.filter(collaborator => collaborator.role.toLowerCase() === this.selectedRole.toLowerCase());
        }

        // Filter by name (firstName + lastName) or email
        if (this.selectedFilterOption === 'name') {
            filteredData = filteredData.filter(collaborator =>
                (collaborator.firstName + ' ' + collaborator.lastName).toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        } else if (this.selectedFilterOption === 'email') {
            filteredData = filteredData.filter(collaborator =>
                collaborator.email.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        //Update the filtered list
        this.filteredCollaborators = filteredData;
    }

    // Dynamic search filtering
    onSearchChange(event: any) {
        this.searchQuery = event.target.value;  // Updates the search term
        this.onFilterChange();  // Applies filtering based on the search term
    }
    /*
    end logique to filter
     */

    onImageError(event: any) {
        event.target.src = 'assets/demo/images/user/user.png';
    }
    /*
    start logique to manage skills
     */
    // Executed when the "Manage skills" button is clicked
    openManageCompetencesDialog(user: User) {
        this.collaboratorToManage = user;
        this.collaboratorToManage.role = this.collaboratorToManage.role.toLowerCase();

        this.selectedTechnologies = this.allTechnologies.filter(tech =>
            user.technologies.some(userTech => userTech.name === tech.value.name)
        ).map(tech => ({
            label: tech.label,
            value: tech.value
        }));

        // open the dialog
        this.displayCompetencesDialog = true;
    }

    // Save the selected technologies
    saveCompetences() {
        console.log('Technologies sélectionnées:', this.selectedTechnologies);

        // Retrieve the selected IDs
        const techIds = this.selectedTechnologies.map(t => t.value.id);

        this.userService.updateUserTechnologies(this.collaboratorToManage.id, techIds)
            .subscribe({
                next: updatedUser => {
                    //Update locally to reflect the server response
                    this.collaboratorToManage.technologies = updatedUser.technologyList;

                    const idx = this.collaborators.findIndex(c => c.id === this.collaboratorToManage.id);
                    if (idx > -1) {
                        this.collaborators[idx] = { ...this.collaboratorToManage };  // clonage superficiel
                    }

                    // 2. Reapply the current filter to regenerate filteredCollaborators
                    this.onFilterChange();

                    this.displayCompetencesDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Updating skills', life: 3000 });
                },
                error: err => {
                    if (err.status === 4203) {
                        this.displayCompetencesDialog = false;
                        this.router.navigate(['/auth/access']);
                        return;
                    }
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'An error occurred while updating skills',
                        life: 3000
                    });
                    console.error('An error occurred while updating skills', err);
                }
            });


    }

    // Close the dialog without saving
    closeDialog() {
        this.displayCompetencesDialog = false;
        this.collaboratorToManage = {};
    }
    /*
    end logique to manage skills
     */

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }
}
