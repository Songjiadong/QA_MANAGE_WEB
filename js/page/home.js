Home = function () { }
Home.registerClass("Home");
Home.Init= function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/home.html", function (respones, status) {
        if (status == "success") {

            //时间轴
            timeLineClick();

            //待审核问题页
            $("#todoQuestion").on('click', function () {
                $("#liQuestionApprove").addClass("selected").siblings().removeClass("selected");
                $(".main-wapper").load("biz/question.html");
            });

            //待审核回答页
            $("#todoAnswer").on('click', function () {
                $("#liAnswerApprove").addClass("selected").siblings().removeClass("selected");
                $(".main-wapper").load("biz/answer.html");
            });


            //发布的talk 
            var colors = ['#5793f3', '#d14a61', '#675bba', '#61a0a8', '#d48265', '#2f4554', '#91c7ae'];

            //问答
            var qaChart = echarts.init(document.getElementById('qaChart'));
            var optionQa = {
                color: colors,
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    top: 70,
                    left: 0,
                    data: ['提问数量', '回答数量']
                },
                grid: {
                    left: '22%',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '回答数量  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: ["2018-1", "2018-2", "2018-3", "2018-4", "2018-5", "2018-6", "2018-7", "2018-8", "2018-9", "2018-10", "2018-11", "2018-12"]
                    },
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '提问数量  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: ["2018-1", "2018-2", "2018-3", "2018-4", "2018-5", "2018-6", "2018-7", "2018-8", "2018-9", "2018-10", "2018-11", "2018-12"]
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '提问数量',
                        type: 'line',
                        xAxisIndex: 1,
                        smooth: true,
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name: '回答数量',
                        type: 'line',
                        smooth: true,
                        data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
                    }
                ]
            };
            qaChart.setOption(optionQa);


            //访问量
            var qaVisit = echarts.init(document.getElementById('qaVisit'));
            var optionVist = {
                color: colors,
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis',
                    padding: 10,
                    textStyle: {
                        height: 50
                    }
                },
                legend: {
                    orient: 'vertical',
                    bottom: 30,
                    left: 10,
                    data: ['智能制造', '工业4.0', '机械重工', '机器人', '搜索引擎', '智能制造2', '工业4.02', '机械重工2', '机器人2', '搜索引擎2'],
                    height: 200,
                    itemGap: 30
                },
                grid: {
                    left: '22%',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '智能制造',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210, 260, 102, 274, 120, 132, 101, 134, 90, 230, 210, 260, 102, 274, 120, 132, 101, 134, 90, 230, 210, 260, 102, 274]
                    },
                    {
                        name: '工业4.0',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310, 286, 265, 315, 220, 182, 191, 234, 290, 330, 310, 286, 265, 315, 220, 182, 191, 234, 290, 330, 310, 286, 265, 315]
                    },
                    {
                        name: '机械重工',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410, 205, 355, 566, 150, 232, 201, 154, 190, 330, 410, 205, 355, 566, 150, 232, 201, 154, 190, 330, 410, 205, 355, 566]
                    },
                    {
                        name: '机器人',
                        type: 'line',
                        stack: '总量',
                        data: [320, 332, 301, 334, 390, 330, 320, 258, 236, 400, 320, 332, 301, 334, 390, 330, 320, 258, 236, 400, 320, 332, 301, 334, 390, 330, 320, 258, 236, 400]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901]
                    },
                    {
                        name: '智能制造2',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210, 260, 102, 274, 120, 132, 101, 134, 90, 230, 210, 260, 102, 274, 120, 132, 101, 134, 90, 230, 210, 260, 102, 274]
                    },
                    {
                        name: '工业4.02',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310, 286, 265, 315, 220, 182, 191, 234, 290, 330, 310, 286, 265, 315, 220, 182, 191, 234, 290, 330, 310, 286, 265, 315]
                    },
                    {
                        name: '机械重工2',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410, 205, 355, 566, 150, 232, 201, 154, 190, 330, 410, 205, 355, 566, 150, 232, 201, 154, 190, 330, 410, 205, 355, 566]
                    },
                    {
                        name: '机器人2',
                        type: 'line',
                        stack: '总量',
                        data: [320, 332, 301, 334, 390, 330, 320, 258, 236, 400, 320, 332, 301, 334, 390, 330, 320, 258, 236, 400, 320, 332, 301, 334, 390, 330, 320, 258, 236, 400]
                    },
                    {
                        name: '搜索引擎2',
                        type: 'line',
                        stack: '总量',
                        data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901]
                    }
                ]
            };
            qaVisit.setOption(optionVist);
        }
    });
}

