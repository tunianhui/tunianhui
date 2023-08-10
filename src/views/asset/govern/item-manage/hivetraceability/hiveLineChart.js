import G2 from '@antv/g2'

export default {
    name: 'hiveLineChart',
    props: {
        data: Array,
        weight: {
            type: Number,
            default: 100
        },
        height: {
            type: Number,
            default: 200
        }
    },
    data() {
        return {
        }
    },
    render() {
        return <div class="g2-chart" ref="chart"></div>
    },
    mounted() {
        this.initchart()
    },
    methods: {
        initchart() {
            const chart = new G2.Chart({
                container: this.$refs.chart,
                forceFit: true,
                // weight: this.weight
                height: this.height
                // height: 400,
                // weight: 1000,
            })
            chart.source(this.data);
            chart.scale('totalsize', {
                min: 0,
                alias: ''
            })
            chart.scale('day', {
                range: [0, 1]
            });
            chart.tooltip({
                crosshairs: {
                type: 'line'
                }
            })
            chart.line().position('day*totalsize');
            chart.point().position('day*totalsize').size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
            })
            chart.render();
        }
    }
}