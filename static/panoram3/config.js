var PannellumConfig = {
    default: {
        firstScene: '7-1-enter',
        author: 'Russian Beavers',
        sceneFadeDuration: 333,
        autoLoad: true,
        type: 'equirectangular'
    },

    scenes: {
        //Первый этаж!
        '7-1-enter': {
            title: 'Вход 1го этажа',
            pitch: 0.71,
            yaw: 43.73,
            hotSpots: [
                {
                    pitch: 0.71,
                    yaw: 43.73,
                    type: 'scene',
                    text: 'Малый холл 2го этажа',
                    sceneId: '7-2-hall-2',
                    cssClass: 'x-up'

                },
                {
                    pitch:  0.20,
                    yaw:  39.36,
                    type: 'scene',
                    text: 'Холл между поточными аудиториями',
                    sceneId: '7-between',
                    cssClass: 'x-go'

                },
                {
                    pitch: -2.8,
                    yaw: -171,
                    type: 'scene',
                    text: 'Холл 1го этажа',
                    sceneId: '7-1-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-between': {
            title: 'Холл между поточными аудиториями',
            pitch:  0.71,
            yaw: -35.54,
            hotSpots: [
                {
                    pitch:  2.04,
                    yaw:  5.75,
                    type: 'scene',
                    text: '1 поточная аудитория',
                    sceneId: '7-1',
                    cssClass: 'x-go'

                },
                {
                    pitch: 2.65,
                    yaw: -83.69,
                    type: 'scene',
                    text: '2 поточная аудитория',
                    sceneId: '7-2',
                    cssClass: 'x-go'

                },
                {
                    pitch:  1.32,
                    yaw:  -23.39,
                    type: 'scene',
                    text: 'Вход 1го этажа',
                    sceneId: '7-1-enter',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-1': {
            title: '1 поточная аудитория',
            pitch: 2.04,
            yaw: 5.75,
            hotSpots: [
                {
                    pitch:  -0.63,
                    yaw:   130.98,
                    type: 'scene',
                    text: 'Холл между поточными аудиториями',
                    sceneId: '7-between',
                    cssClass: 'x-go'

                }
            ]
        }
        ,
        '7-2': {
            title: '2 поточная аудитория',
            pitch:  2.54,
            yaw: 125.6,
            hotSpots: [
                {
                    pitch:  0.84,
                    yaw:   -79.64,
                    type: 'scene',
                    text: 'Холл между поточными аудиториями',
                    sceneId: '7-between',
                    cssClass: 'x-go'

                }
            ]
        }
        ,
        '7-1-hall': {
            title: 'Холл 1го этажа',
            pitch:  1.18,
            yaw: -36.90,
            hotSpots: [
                // {
                //     pitch: 3.76,
                //     yaw: 20,
                //     type: 'scene',
                //     text: 'Холл 2го этажа',
                //     sceneId: '7-2-hall',
                //     cssClass: 'x-up'
                // }
                // ,
                {
                    pitch: -4.66,
                    yaw: 139.6,
                    type: 'scene',
                    text: 'Вход 1го этажа',
                    sceneId: '7-1-enter',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch:  0.85,
                    yaw: -86.73,
                    type: 'scene',
                    text: 'Большой коридор 1го этажа',
                    sceneId: '7-1-big',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch: -0.17,
                    yaw: -6.6,
                    type: 'scene',
                    text: 'Холл 2го этажа',
                    sceneId: '7-2-hall',
                    cssClass: 'x-up'
                }
            ]
        }
        ,
        '7-1-big': {
            title: 'Большой коридор 1го этажа',
            pitch:  1.22,
            yaw: -93.39,
            hotSpots: [
                {
                    pitch: 0.08,
                    yaw:  -86.11,
                    type: 'scene',
                    text: 'Столовая',
                    sceneId: '7-1-canteen',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch: 0.63,
                    yaw: -133.1,
                    type: 'scene',
                    text: '106 аудитория',
                    sceneId: '7-106',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch: 1.37,
                    yaw:  85.63,
                    type: 'scene',
                    text: 'Холл 1го этажа',
                    sceneId: '7-1-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-106': {
            title: '106 аудитория',
            pitch: 0.06,
            yaw:  167.47,
            hotSpots: [
                {
                    pitch: -2.18,
                    yaw:  -125.35,
                    type: 'scene',
                    text: 'Большой коридор 1го этажа',
                    sceneId: '7-1-big',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-1-canteen': {
            title: 'Столовая',
            pitch: 0.80,
            yaw:  -78.24,
            hotSpots: [
                {
                    pitch:  0.74,
                    yaw:  160.31,
                    type: 'scene',
                    text: 'Большой коридор 1го этажа',
                    sceneId: '7-1-big',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        //ВТОРОЙ ЭТАЖ!!
        '7-2-hall': {
            title: 'Холл 2го этажа',
            pitch: 0.27,
            yaw: -177.99,
            hotSpots: [
                {
                    pitch:  0.09,
                    yaw:  178.69,
                    type: 'scene',
                    text: 'Холл 1го этажа',
                    sceneId: '7-1-hall',
                    cssClass: 'x-down'
                },
                {
                    pitch:   0.75,
                    yaw:  -163.4,
                    type: 'scene',
                    text: 'Холл 3го этажа',
                    sceneId: '7-3-hall',
                    cssClass: 'x-up'
                },
                {
                    pitch:   0.08,
                    yaw:   60.70,
                    type: 'scene',
                    text: 'Малый холл 2го этажа',
                    sceneId: '7-2-hall-2',
                    cssClass: 'x-go'
                },
                {
                    pitch:   0.08,
                    yaw:   60.70,
                    type: 'scene',
                    text: 'Большой коридор 2го этажа',
                    sceneId: '7-2-big',
                    cssClass: 'x-go'
                },
                {
                    pitch:    1.42,
                    yaw:    141.32,
                    type: 'scene',
                    text: 'Аудитория 213',
                    sceneId: '7-2-213',
                    cssClass: 'x-go'
                },
                {
                    pitch:   1.24,
                    yaw:    145.49,
                    type: 'scene',
                    text: 'Аудитория 218',
                    sceneId: '7-2-218',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-2-big': {
            title: 'Холл 2го этажа',
            pitch: 0.27,
            yaw: -177.99,
            hotSpots: [
                {
                    pitch:  0.09,
                    yaw:  178.69,
                    type: 'scene',
                    text: 'Холл 1го этажа',
                    sceneId: '7-1-hall',
                    cssClass: 'x-down'
                },
                {
                    pitch:   0.75,
                    yaw:  -163.4,
                    type: 'scene',
                    text: 'Холл 3го этажа',
                    sceneId: '7-3-hall',
                    cssClass: 'x-up'
                },
                {
                    pitch:   0.08,
                    yaw:   60.70,
                    type: 'scene',
                    text: 'Малый холл 2го этажа',
                    sceneId: '7-2-hall-2',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-2-213': {
            title: 'Аудитория 213',
            pitch:  2.26,
            yaw: 23.59,
            hotSpots: [
                {
                    pitch:  0.19,
                    yaw:   -174.07,
                    type: 'scene',
                    text: 'Холл 2го этажа',
                    sceneId: '7-2-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-2-218': {
            title: 'Аудитория 218',
            pitch: -1.18,
            yaw:  -87.84,
            hotSpots: [
                {
                    pitch:  1.63,
                    yaw:  95.73,
                    type: 'scene',
                    text: 'Холл 1го этажа',
                    sceneId: '7-1-hall',
                    cssClass: 'x-down'
                }
            ]
        }
        ,
        '7-2-hall-2': {
            title: 'Малый холл 1го этажа',
            pitch: -3.35,
            yaw: -173.86,
            hotSpots: [
                {
                    pitch: 1.99,
                    yaw: 90.14,
                    type: 'scene',
                    text: 'Холл 2го этажа',
                    sceneId: '7-2-hall',
                    cssClass: 'x-go'
                },
                {
                    pitch: -0.64,
                    yaw:  -71.71,
                    type: 'scene',
                    text: '3 поточная аудитория',
                    sceneId: '7-2-3',
                    cssClass: 'x-go'
                },
                {
                    pitch:  -7.61,
                    yaw: -89.95,
                    type: 'scene',
                    text: 'Вход 1го этажа',
                    sceneId: '7-1-enter',
                    cssClass: 'x-down'
                }
            ]
        }
        ,
        '7-2-3': {
            title: '3 поточная аудитория',
            pitch: 5.507,
            yaw: -166.37,
            hotSpots: [
                {
                    pitch:  -0.99,
                    yaw: -76.88,
                    type: 'scene',
                    text: 'Малый холл 2го этажа',
                    sceneId: '7-2-hall-2',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        //ТРЕТИЙ ЭТАЖ!!!
        '7-3-hall': {
            title: 'Холл 3го этажа',
            pitch:   -4.65,
            yaw:  179.4,
            hotSpots: [
                {
                    pitch: -5.98,
                    yaw:  172.20,
                    type: 'scene',
                    text: 'Холл 2го этажа',
                    sceneId: '7-2-hall',
                    cssClass: 'x-down'
                }
                ,
                {
                    pitch:  -5.32,
                    yaw: -156.08,
                    type: 'scene',
                    text: 'Холл 4го этажа',
                    sceneId: '7-4-hall',
                    cssClass: 'x-up'
                }
                ,
                {
                    pitch: 0.83,
                    yaw:  117.56,
                    type: 'scene',
                    text: 'Большой коридор 3го этажа',
                    sceneId: '7-3-big',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch: 2.68,
                    yaw: -59.86,
                    type: 'scene',
                    text: 'Малый коридор 3го этажа',
                    sceneId: '7-3-small',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-3-big': {
            title: 'Большой коридор 3го этажа',
            pitch: -0.9,
            yaw: -1.7,
            hotSpots: [
                {
                    pitch: -0.9,
                    yaw: -1.7,
                    type: 'scene',
                    text: 'Холл 3го этажа',
                    sceneId: '7-3-hall',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch: -1.3,
                    yaw: -6.5,
                    type: 'scene',
                    text: 'Аудитория 320',
                    sceneId: '7-320',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-3-small': {
            title: 'Малый коридор 3го этажа',
            pitch: -1.9,
            yaw: 3,
            hotSpots: [
                {
                    pitch: 1.30,
                    yaw:  177.93,
                    type: 'scene',
                    text: 'Холл 3го этажа',
                    sceneId: '7-3-hall',
                    cssClass: 'x-go'
                },
                {
                    pitch: 2.76,
                    yaw: -15.74,
                    type: 'scene',
                    text: 'Лаборатория Cisco',
                    sceneId: '7-303',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-320': {
            title: 'Аудитория 320',
            pitch: -1.9,
            yaw: 3,
            hotSpots: [
                {
                    pitch: -0.5,
                    yaw: -53.2,
                    type: 'scene',
                    text: 'Большой коридор 3го этажа',
                    sceneId: '7-3-big',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-303': {
            title: 'Лаборатория Cisco',
            pitch: 0.18,
            yaw:  77.99,
            hotSpots: [
                {
                    pitch: -1.29,
                    yaw:  -152,
                    type: 'scene',
                    text: 'Малый коридор 3го этажа',
                    sceneId: '7-3-small',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        //ЧЕТВЕРТЫЙ ЭТАЖ!!!!
        '7-4-hall': {
            title: 'Холл 4го этажа',
            pitch: 1.16,
            yaw: -132.18,
            hotSpots: [
                {
                    pitch: 0.87,
                    yaw:  -148.90,
                    type: 'scene',
                    text: 'Холл 3го этажа',
                    sceneId: '7-3-hall',
                    cssClass: 'x-down'
                }
                ,
                {
                    pitch:  0.64,
                    yaw: -118.85,
                    type: 'scene',
                    text: 'Холл 5го этажа',
                    sceneId: '7-5-hall',
                    cssClass: 'x-up'
                }
                ,
                {
                    pitch:  0.72,
                    yaw:  168.59,
                    type: 'scene',
                    text: 'Большой коридор 4го этажа',
                    sceneId: '7-4-big',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch: 2.40,
                    yaw: -2.16,
                    type: 'scene',
                    text: 'Малый коридор 4го этажа',
                    sceneId: '7-4-small',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-4-big': {
            title: 'Большой коридор 4го этажа',
            pitch: 5.01,
            yaw:  -6.78,
            hotSpots: [
                {
                    pitch: 0.58,
                    yaw: -157.33,
                    type: 'scene',
                    text: 'Холл 4го этажа',
                    sceneId: '7-4-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-4-small': {
            title: 'Малый коридор 4го этажа',
            pitch:  -0.41,
            yaw:  -1.99,
            hotSpots: [
                {
                    pitch: 1.59,
                    yaw: 175.18,
                    type: 'scene',
                    text: 'Холл 4го этажа',
                    sceneId: '7-4-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        //ПЯТЫЙ ЭТАЖ!!!!!
        '7-5-hall': {
            title: 'Холл 5го этажа',
            pitch:  -4.74,
            yaw: -88.31,
            hotSpots: [
                {
                    pitch:  -2.71,
                    yaw:  -104.47,
                    type: 'scene',
                    text: 'Холл 4го этажа',
                    sceneId: '7-4-hall',
                    cssClass: 'x-down'
                }
                ,
                {
                    pitch:  -1.31,
                    yaw: -73.44,
                    type: 'scene',
                    text: 'Холл 6го этажа',
                    sceneId: '7-6-hall',
                    cssClass: 'x-up'
                }
                ,
                // {
                //     pitch:  -1.36,
                //     yaw:  -149.01,
                //     type: 'scene',
                //     text: 'Большой коридор 5го этажа',
                //     sceneId: '7-5-big',
                //     cssClass: 'x-go'
                // }
                // ,
                {
                    pitch:  -1.69,
                    yaw: 34.86,
                    type: 'scene',
                    text: 'Малый коридор 5го этажа',
                    sceneId: '7-5-small',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-5-big': {
            title: 'Большой коридор 5го этажа',
            pitch: 5.01,
            yaw:  -6.78,
            hotSpots: [
                {
                    pitch: 0.58,
                    yaw: -157.33,
                    type: 'scene',
                    text: 'Холл 5го этажа',
                    sceneId: '7-5-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-5-small': {
            title: 'Малый коридор 5го этажа',
            pitch:  -1.65,
            yaw:   -32.06,
            hotSpots: [
                {
                    pitch: -3.01,
                    yaw:  150.67,
                    type: 'scene',
                    text: 'Холл 5го этажа',
                    sceneId: '7-5-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        //ШЕСТОЙ ЭТАЖ!!!!!!
        '7-6-hall': {
            title: 'Холл 6го этажа',
            pitch:  -0.25,
            yaw: 98.23,
            hotSpots: [
                {
                    pitch:  -0.44,
                    yaw:  88.20,
                    type: 'scene',
                    text: 'Холл 5го этажа',
                    sceneId: '7-5-hall',
                    cssClass: 'x-down'
                }
                ,
                {
                    pitch:  0.197,
                    yaw: 120.38,
                    type: 'scene',
                    text: 'Холл 7го этажа',
                    sceneId: '7-7-hall',
                    cssClass: 'x-up'
                }
                ,
                {
                    pitch:   -1.25,
                    yaw:  -139.50,
                    type: 'scene',
                    text: 'Малый коридор 6го этажа',
                    sceneId: '7-6-small',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch:  -1.69,
                    yaw: 34.86,
                    type: 'scene',
                    text: 'Большой коридор 6го этажа',
                    sceneId: '7-6-big',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-6-big': {
            title: 'Большой коридор 6го этажа',
            pitch: -1.11,
            yaw:  -146.18,
            hotSpots: [
                {
                    pitch: 1.07,
                    yaw: 46.64,
                    type: 'scene',
                    text: 'Холл 6го этажа',
                    sceneId: '7-6-hall',
                    cssClass: 'x-go'
                },
                {
                    pitch: -0.08,
                    yaw: -143.18,
                    type: 'scene',
                    text: 'Аудитория 609',
                    sceneId: '7-609',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-6-small': {
            title: 'Малый коридор 6го этажа',
            pitch:  -1.65,
            yaw:   -32.06,
            hotSpots: [
                {
                    pitch: -3.01,
                    yaw:  150.67,
                    type: 'scene',
                    text: 'Холл 6го этажа',
                    sceneId: '7-6-hall',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch:  -1.27,
                    yaw:  -154.13,
                    type: 'scene',
                    text: 'Аудитория 601',
                    sceneId: '7-601',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch:   0.95,
                    yaw:  -0.11,
                    type: 'scene',
                    text: 'Аудитория 603',
                    sceneId: '7-603',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch:   -0.66,
                    yaw:  -61.65,
                    type: 'scene',
                    text: 'Лаборатория National Instruments',
                    sceneId: '7-602',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-601': {
            title: 'Аудитория 601',
            pitch:  -0.90,
            yaw:  -157.94,
            hotSpots: [
                {
                    pitch:  1.03,
                    yaw:  -119.92,
                    type: 'scene',
                    text: 'Малый коридор 6го этажа',
                    sceneId: '7-6-small',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-602': {
            title: 'Лаборатория National Instruments',
            pitch:   -8.54,
            yaw:  -165.87,
            hotSpots: [
                {
                    pitch:  -3.82,
                    yaw:  -99.94,
                    type: 'scene',
                    text: 'Малый коридор 6го этажа',
                    sceneId: '7-6-small',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-603': {
            title: 'Аудитория 603',
            pitch:  -12.13,
            yaw:   -70.24,
            hotSpots: [
                {
                    pitch:  -0.61,
                    yaw:   142.12,
                    type: 'scene',
                    text: 'Малый коридор 6го этажа',
                    sceneId: '7-6-small',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-609': {
            title: 'Аудитория 609',
            pitch:  -9.96,
            yaw:   127.7,
            hotSpots: [
                {
                    pitch:  -3.65,
                    yaw:   25.73,
                    type: 'scene',
                    text: 'Большой коридор 6го этажа',
                    sceneId: '7-6-big',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        //СЕДЬМОЙ ЭТАЖ!!!!!!!
        '7-7-hall': {
            title: 'Холл 7го этажа',
            pitch: -1.36,
            yaw: -45.85,
            hotSpots: [
                {
                    pitch: -5,
                    yaw: -53,
                    type: 'scene',
                    text: 'Холл 6го этажа',
                    sceneId: '7-6-hall',
                    cssClass: 'x-down'
                }
                ,
                {
                    pitch: -2.32,
                    yaw: -21.10,
                    type: 'scene',
                    text: 'Холл 8го этажа',
                    sceneId: '7-8-hall',
                    cssClass: 'x-up'
                }
                ,
                {
                    pitch: -3.2,
                    yaw: -107,
                    type: 'scene',
                    text: 'Большой коридор 7го этажа',
                    sceneId: '7-7-big',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch: -2.2,
                    yaw: 71,
                    type: 'scene',
                    text: 'Малый коридор 7го этажа',
                    sceneId: '7-7-small',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-7-big': {
            title: 'Большой коридор 7го этажа',
            pitch: -2.1,
            yaw: 178,
            hotSpots: [
                {
                    pitch: -2.1,
                    yaw: 178,
                    type: 'scene',
                    text: 'Холл 7го этажа',
                    sceneId: '7-7-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-7-small': {
            title: 'Малый коридор 7го этажа',
            pitch: 0,
            yaw: 179,
            hotSpots: [
                {
                    pitch: 0,
                    yaw: 179,
                    type: 'scene',
                    text: 'Холл 7го этажа',
                    sceneId: '7-7-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-8-hall': {
            title: 'Холл 8го этажа',
            pitch: 1.34,
            yaw:  -88.17,
            hotSpots: [
                {
                    pitch: 0.86,
                    yaw: -102,
                    type: 'scene',
                    text: 'Холл 7го этажа',
                    sceneId: '7-7-hall',
                    cssClass: 'x-down'
                }
                ,
                {
                    pitch: -1.8,
                    yaw: -151,
                    type: 'scene',
                    text: 'Большой коридор 8го этажа',
                    sceneId: '7-8-big',
                    cssClass: 'x-go'
                }
                ,
                {
                    pitch: -2.5,
                    yaw: 33,
                    type: 'scene',
                    text: 'Малый коридор 8го этажа',
                    sceneId: '7-8-small',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-8-big': {
            title: 'Большой коридор 8го этажа',
            pitch: -2.1,
            yaw: -179,
            hotSpots: [
                {
                    pitch: -2.1,
                    yaw: -179,
                    type: 'scene',
                    text: 'Холл 8го этажа',
                    sceneId: '7-8-hall',
                    cssClass: 'x-go'
                }
            ]
        }
        ,
        '7-8-small': {
            title: 'Малый коридор 8го этажа',
            pitch: -2.2,
            yaw: -0.9,
            hotSpots: [
                {
                    pitch:  -2.26,
                    yaw:  179.45,
                    type: 'scene',
                    text: 'Холл 8го этажа',
                    sceneId: '7-8-hall',
                    cssClass: 'x-go'
                }
            ]
        }
    }
};