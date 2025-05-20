import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {DataView} from "primeng/dataview";
import {Product} from "../../../../api/product";
import {ProductService} from "../../../../service/product.service";
import {User} from "../../../../api/user";
import {UserService} from "../../../../service/user.service";
import {CountryService} from "../../../../service/country.service";

@Component({
  selector: 'app-collaborator-list',
  templateUrl: './collaborator-list.component.html',
  styleUrls: ['./collaborator-list.component.scss']
})
export class CollaboratorListComponent implements OnInit{
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
    selectedRole: string = '';  // Rôle sélectionné
    selectedFilterOption: string = '';  // Option de filtrage sélectionnée (par nom ou email)
    searchQuery: string = '';  // Recherche par nom ou email

    sortOptions: SelectItem[] = [];
    sortOrder: number = 0;
    sortField: string = '';

    /*
    start attributes to manage competences
     */
    displayCompetencesDialog: boolean = false;
    selectedTechnologies: any[] = [];
    allTechnologies: SelectItem[] = []; // Liste des technologies disponibles
    collaboratorToManage: User = {} // pour récupérer le collaborateur à manager leur compétences
    /*
    end attributes to manage competences
     */

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userService.getCollaborators().then(data => {
                this.collaborators = data;
                this.filteredCollaborators = [...this.collaborators];
            console.log("collaborators: " );
            console.log(this.collaborators);

            console.log("filteredCollaborators: " );
            console.log(this.filteredCollaborators);
            }
        );

        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' }
        ];
        this.selectedFilterOption = 'name';

        // Initialisation avec des données mockées
        this.allTechnologies = [
            { label: 'JavaScript', value: { name: 'JavaScript', description: 'A powerful programming language for web development' } },
            { label: 'Python', value: { name: 'Python', description: 'A versatile language for general purpose programming' } },
            { label: 'JAVA', value: { name: 'JAVA', description: 'A high-performance language for enterprise applications' } },
            { label: 'Angular', value: { name: 'Angular', description: 'A web framework for building modern applications' } },
            { label: 'C++', value: { name: 'C++', description: 'A JavaScript library for building user interfaces' } },
            { label: 'PLSQL', value: { name: 'PLSQL', description: 'description for PLSQL' } }
        ];
        // this.allTechnologies = [
        //     { label: 'JavaScript', value: { name: 'JavaScript' } },
        //     { label: 'PLSQL', value: { name: 'PLSQL' } },
        //     { label: 'JAVA', value: { name: 'JAVA' } },
        //     { label: 'Angular', value: { name: 'Angular' } },
        //     { label: 'C++', value: { name: 'C++' } }
        // ];
    }

    /*
    start logique to filter
     */
    // Filtrage en fonction du rôle et du champ de recherche
    onFilterChange() {
        let filteredData = this.collaborators;

        // Filtrer par rôle
        if (this.selectedRole) {
            filteredData = filteredData.filter(collaborator => collaborator.role === this.selectedRole);
        }

        // Filtrage par nom (firstName + lastName) ou email
        if (this.selectedFilterOption === 'name') {
            filteredData = filteredData.filter(collaborator =>
                (collaborator.firstName + ' ' + collaborator.lastName).toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        } else if (this.selectedFilterOption === 'email') {
            filteredData = filteredData.filter(collaborator =>
                collaborator.email.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // Mettre à jour la liste filtrée
        this.filteredCollaborators = filteredData;
    }

    // Filtrage dynamique de la recherche
    onSearchChange(event: any) {
        this.searchQuery = event.target.value;  // Met à jour le terme de recherche
        this.onFilterChange();  // Applique le filtrage en fonction du terme de recherche
    }
    /*
    end logique to filter
     */

    onImageError(event: any) {
        event.target.src = 'assets/demo/images/user/user.png';
    }
    /*
    start logique to manage competences
     */
    // Exécution lorsque le bouton "Manage Competences" est cliqué
    openManageCompetencesDialog(user: User) {
        this.collaboratorToManage = user;
        this.collaboratorToManage.role = this.collaboratorToManage.role.toLowerCase();
        // Remplir les technologies de l'utilisateur
        this.selectedTechnologies = this.allTechnologies.filter(tech =>
            user.technologies.some(userTech => userTech.name === tech.value.name)
        ).map(tech => ({
            label: tech.label,
            value: tech.value
        }));


        console.log('Technologies disponibles:', this.allTechnologies);
        console.log('Technologies de l\'utilisateur:', this.selectedTechnologies);

        // Ouvrir le dialog
        this.displayCompetencesDialog = true;
    }

    // Sauvegarder les technologies sélectionnées
    saveCompetences() {
        console.log('Technologies sélectionnées:', this.selectedTechnologies);
        // Ici, tu peux envoyer les modifications au backend ou mettre à jour l'utilisateur localement
        this.displayCompetencesDialog = false;
    }

    // Fermer le dialog sans enregistrer
    closeDialog() {
        this.displayCompetencesDialog = false;
        this.collaboratorToManage = {};
    }
    /*
    end logique to manage competences
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
