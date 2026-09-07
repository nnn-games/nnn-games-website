// 프로젝트 데이터 로더
// 단일 진실 원천: data/projects.json
let projectsData = {
    featured: [],
    all: [],
    summary: {
        hero: {
            projectCount: 0,
            projectIds: [],
            totalVisits: 0,
            visitProjectIds: [],
            updatedAt: null
        }
    }
};

const getProjectReporting = function (project) {
    return project && typeof project.reporting === 'object' && project.reporting
        ? project.reporting
        : {};
};

const isActiveProject = function (project) {
    return project && project.status === 'active';
};

const shouldIncludeInHeroProjectCount = function (project) {
    const reporting = getProjectReporting(project);
    const include = typeof reporting.includeInHeroProjectCount === 'boolean'
        ? reporting.includeInHeroProjectCount
        : true;
    return isActiveProject(project) && include;
};

const shouldIncludeInHeroVisitTotal = function (project) {
    const reporting = getProjectReporting(project);
    const include = typeof reporting.includeInHeroVisitTotal === 'boolean'
        ? reporting.includeInHeroVisitTotal
        : true;
    return isActiveProject(project) && include;
};

const buildProjectSummary = function (projects, updatedAt = null) {
    const heroProjects = (projects || []).filter(shouldIncludeInHeroProjectCount);
    const visitProjects = (projects || []).filter(shouldIncludeInHeroVisitTotal);
    const totalVisits = visitProjects.reduce((sum, project) => {
        const visits = project && project.metrics && typeof project.metrics.visits === 'number'
            ? project.metrics.visits
            : 0;
        return sum + visits;
    }, 0);

    return {
        hero: {
            projectCount: heroProjects.length,
            projectIds: heroProjects.map(project => project.id),
            totalVisits,
            visitProjectIds: visitProjects.map(project => project.id),
            updatedAt
        }
    };
};

const ProjectManager = {
    loadPromise: null,

    loadProjectsData: function () {
        if (this.loadPromise) return this.loadPromise;
        this.loadPromise = fetch('data/projects.json', { cache: 'no-cache' })
            .then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to load projects.json')))
            .then(json => {
                const all = Array.isArray(json.all) ? json.all : [];
                const summary = json.summary || buildProjectSummary(all, null);
                projectsData = {
                    all,
                    featured: all.filter(p => p.featured),
                    summary
                };
                return projectsData;
            })
            .catch(err => {
                console.warn('[ProjectManager] Failed to load projects.json:', err);
                return projectsData;
            });
        return this.loadPromise;
    },

    getAll: function () {
        return projectsData.all;
    },
    getFeatured: function () {
        return projectsData.featured;
    },
    getSummary: function () {
        if (!projectsData.summary) {
            projectsData.summary = buildProjectSummary(projectsData.all, null);
        }
        return projectsData.summary;
    },
    getHeroSummary: function () {
        const summary = this.getSummary();
        return summary && summary.hero ? summary.hero : buildProjectSummary(projectsData.all, null).hero;
    },
    getHeroProjects: function () {
        return projectsData.all.filter(shouldIncludeInHeroProjectCount);
    },
    getProject: function (id) {
        return projectsData.all.find(project => project.id === id);
    },
    getProjectsByCategory: function (category) {
        return projectsData.all.filter(project => project.category === category);
    },
    getProjectsByStatus: function (status) {
        return projectsData.all.filter(project => project.status === status);
    },
    getFeaturedProjects: function () {
        return projectsData.featured;
    }
};

window.projectsData = projectsData;
window.ProjectManager = ProjectManager;
