class AboutCtrl {
    constructor($scope, $state, PagesService, Notification) {
        'ngInject';

        this.team = [
            [{
                    name: 'Albert Poghosyan',
                    img: '../../../images/about/abo.png',
                    position: 'COO'
                },
                {
                    name: 'Aram Avetisyan',
                    img: '../../../images/about/aram.png',
                    position: 'CTO'
                },
                {
                    name: 'Grigor Khachatryan',
                    img: '../../../images/about/grig.png',
                    position: 'Development Team Lead'
                },
                {
                    name: 'Mariam Adamyan',
                    img: '../../../images/about/mariam.png',
                    position: 'Quality Assurance'
                }
            ],
            [{
                    name: 'Lusine Kuchukyan',
                    img: '../../../images/about/lusine.png',
                    position: 'Product Owner'
                },
                {
                    name: 'Khachatur Gharibyan',
                    img: '../../../images/about/khcho.png',
                    position: 'Developer'
                },
                {
                    name: 'Khatchadour Israelyan',
                    img: '../../../images/about/khatchadour.png',
                    position: 'Designer'
                },
                {
                    name: 'Christina Karapetyan',
                    img: '../../../images/about/cristina.png',
                    position: 'Developer'
                },
            ],
            [{
                    name: 'Mher Simonyan',
                    img: '../../../images/about/mher.png',
                    position: 'Quality Assurance'
                },
                {
                    name: 'Gor Matevosyan',
                    img: '../../../images/about/gor.png',
                    position: 'Developer'
                },
                {
                    name: 'Raffi Hovhannisyan',
                    img: '../../../images/about/raffi.png',
                    position: 'Developer'
                },
                {
                    name: 'Sergey Hovakimyan',
                    img: '../../../images/about/serg.png',
                    position: 'Developer'
                },
            ]
        ];

        this.workprocess = [
            [{
                    name: 'Mortal Kombat',
                    img: '../../../images/about/1.png',
                    position: ''
                },
                {
                    name: 'VR Cooking',
                    img: '../../../images/about/2.png',
                    position: ''
                },
                {
                    name: '#Qyart',
                    img: '../../../images/about/3.png',
                    position: ''
                },
            ],
            [{
                    name: 'Zvukavik is dead',
                    img: '../../../images/about/4.png',
                    position: ''
                },
                {
                    name: 'Steve on duty',
                    img: '../../../images/about/5.png',
                    position: ''
                },
                {
                    name: '#Uxtaglaz',
                    img: '../../../images/about/6.png',
                    position: ''
                },
            ]
        ]

    }
    meetTheTeam() {
        angular.element('html,body').animate({
            scrollTop: angular.element('#team')[0].offsetTop,
        }, {
            duration: 500,
            complete: function() {

            },
        });
    }
    meetTheHardworkers() {
        angular.element('html,body').animate({
            scrollTop: angular.element('#hardworkers')[0].offsetTop,
        }, {
            duration: 500,
            complete: function() {

            },
        });
    }
}
export default AboutCtrl;