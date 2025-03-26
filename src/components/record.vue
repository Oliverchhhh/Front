<ifreme @click.native="goFuncPage('/concolic')">
    <div slot="func_icon">
      <!-- 图片 -->
      <img class="icon_img" src="../assets/img/concolicIcon.png">
    </div>
    <!-- 功能名 -->
    <div slot="header" class="func_name">测试样本自动生成</div>
    <!-- 功能描述 -->
    <div slot="des_func" class="func_des">基于动态符号执行，通过执行具体输入用例获取模型神经元状态，并通过模拟模型计算原理构造约束变量，生成激活特定未被激活过新神经元的测试用例</div>
  </ifreme>
  <!-- 数据公平性评估 -->
  <ifreme  @click.native="goFuncPage('/dataFairnessEva')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/dataFairEvalIcon.png">
    </div>
    <div slot="header" class="func_name">数据公平性评估</div>
    <div slot="des_func" class="func_des">针对数据集存在偏见的现象，通过数据公平性评估算法，对数据集整体进行评估，可视化展示数据群体、个体、属性占比、属性相关性的评估结果</div>
  </ifreme>
  <!-- 数据公平性提升 -->
  <ifreme @click.native="goFuncPage('/dataFairnessDebias')"> 
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/dataFairDebiasIcon.png">
    </div>
    <div slot="header" class="func_name">数据公平性提升</div>
    <div slot="des_func" class="func_des">基于公平表征学习和数据重赋权等方法对数据集进行纠偏，从群体和个体公平性两个维度对提升前后的数据集进行评估对比</div>
  </ifreme>
  <!-- 异常数据检测 -->
  <ifreme @click.native="goFuncPage('/dataClean')">
    <div slot="func_icon">
      <!-- 图片 -->
      <img class="icon_img" src="../assets/img/dataCleanIcon.png">
    </div>
    <!-- 功能名 -->
    <div slot="header" class="func_name">异常数据检测</div>
    <!-- 功能描述 -->
    <div slot="des_func" class="func_des">分析AI系统常见异常数据来源及类型，基于置信学习等多种技术修复异常数据，实现自动化的数据集清洗及量化评估</div>
  </ifreme>

<ifreme @click.native="goFuncPage('/advAttack')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/advAttackEvalIcon.png">
    </div>
    <div slot="header" class="func_name">对抗攻击评估</div>
    <div slot="des_func" class="func_des">汇集多种主流对抗攻击方法，包括黑盒对抗攻击、白盒对抗攻击，探索深度学习模型在对抗攻击方面的鲁棒性下限，可视化展示攻击对模型的影响</div>
  </ifreme>
  <ifreme @click.native="goFuncPage('/backdoor')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/bkAttackEvalIcon.png">
    </div>
    <div slot="header" class="func_name">后门攻击评估</div>
    <div slot="des_func" class="func_des">集成多种主流投毒攻击方法，对深度学习数据和模型进行攻击，评估模型在后门攻击层面上的应变能力，可视化评估投毒攻击影响</div>
  </ifreme>
  <ifreme @click.native="goFuncPage('/autoAttack')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/advTestIcon.png">
    </div>
    <div slot="header" class="func_name">模型对抗性测试</div>
    <div slot="des_func" class="func_des">基于攻防战技知识图谱和规则集自动化生成特定场景下的AI模型对抗测试方案，从而对AI模型的鲁棒性进行评估</div>
  </ifreme>
  <ifreme @click.native="goFuncPage('/modelFairnessEva')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/modelFairEvalIcon.png">
    </div>
    <div slot="header" class="func_name">模型公平性评估</div>
    <div slot="des_func" class="func_des">针对深度学习模型预测存在偏见的现象，通过30+种模型公平性评估算法，对模型进行评估，从个体公平性和群体公平性可视化展示评估结果</div>
  </ifreme>
  <ifreme @click.native="goFuncPage('/modelMeasure')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/modelMeasureIcon.png">
    </div>
    <div slot="header" class="func_name">AI模型安全度量</div>
    <div slot="des_func" class="func_des">对模型进行安全性、鲁棒性、泛化性度量，评估模型对对抗攻击的防御效果、对自然噪声的健壮能力、相似任务的泛化性能</div>
  </ifreme>
  <ifreme @click.native="goFuncPage('/coverage_neural')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/coverageneuralIcon.png">
    </div>
    <div slot="header" class="func_name">标准化单元测试</div>
    <div slot="des_func" class="func_des">评估模型训练效果时容易出现模型行中的某些行为无法被测试到的情况，提出制定多测试准则的标准化AI模型单元测试方法，全面评估模型训练效果</div>
  </ifreme>

<ifreme @click.native="goFuncPage('/advAttackDefense')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/advDefenseIcon.png">
    </div>
    <div slot="header" class="func_name">对抗攻击防御</div>
    <div slot="des_func" class="func_des">从对抗样本检测、对抗噪声擦除和模型防御力增强等三个角度阻截对抗样本的攻击，并使神经网络模型在面对对抗样本时仍能发挥正常功能</div>
  </ifreme>
  <ifreme @click.native="goFuncPage('/backdoorDefense')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/bkDefenseIcon.png">
    </div>
    <div slot="header" class="func_name">后门攻击防御</div>
    <div slot="des_func" class="func_des">后门攻击防御包括后门检测和后门逆向，力求做到发现后门并还原后门的效果，使后门攻击的威胁大大降低</div>
  </ifreme>
  <ifreme  @click.native="goFuncPage('robust_advTraining')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/robustTrainingIcon.png">
    </div>
    <div slot="header" class="func_name">模型鲁棒性训练</div>
    <div slot="des_func" class="func_des">通过可认证鲁棒训练、对抗训练等方式来对AI模型进行安全加固，提升模型在对抗样本攻击下的鲁棒性</div>
  </ifreme>
  <ifreme  @click.native="goFuncPage('/modelFairnessDebias')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/modelFairDebiasIcon.png">
    </div>
    <div slot="header" class="func_name">模型公平性提升</div>
    <div slot="des_func" class="func_des">模型决策会存在偏见，通过公平性提升算法，提升模型的公平性，减少偏见，可视化展示提升前后对比</div>
  </ifreme>
  <ifreme  @click.native="goFuncPage('/crowdDefense')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/crowdDefenseIcon.png">
    </div>
    <div slot="header" class="func_name">模型群智化防御</div>
    <div slot="des_func" class="func_des">基于集成防御、攻防博弈等技术，可视化展示模型在不同攻击与防御方法上的表现，从而获取最佳防御策略</div>
  </ifreme>

<ifreme @click.native="goFuncPage('/FormalVerfy')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/formalVerifyIcon.png">
    </div>
    <div slot="header" class="func_name">形式化验证</div>
    <div slot="des_func" class="func_des">基于扰动分析和特征解释可视化方法，对模型进行安全性、一致性、可达性三个维度的形式化验证，从严格统计角度验证模型安全性能</div>
  </ifreme>  
  <ifreme @click.native="goFuncPage('/modularDevelop')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/modularDevelopIcon.png">
    </div>

    <div slot="header" class="func_name">AI模型模块化开发</div>
    <div slot="des_func" class="func_des">基于模块化的思想，为给定任务功能进行组件式构建、自动化训练并保存模型，并可视化显示模型的各项性能指标</div>
  </ifreme>
  
  <ifreme @click.native="goFuncPage('/exMethod')">
    <div slot="func_icon">
      <img class="icon_img" src="../assets/img/exMethodIcon.png">
    </div>
    <div slot="header" class="func_name">攻击机理分析</div>
    <div slot="des_func" class="func_des">研究各类对抗性攻击的生成与作用机理，即误导模型的内在原因，建立易于人类理解的解释方法，为安全性验证与防御策略构建等工作提供理论指导</div>
  </ifreme>

<ifreme @click.native="goFuncPage('/frameworkTest')">
    <div slot="func_icon">
      <!-- 图片 -->
      <img class="icon_img" src="../assets/img/frameworkTestIcon.png">
    </div>
    <!-- 功能名 -->
    <div slot="header" class="func_name">AI开发框架安全结构度量</div>
    <!-- 功能描述 -->
    <div slot="des_func" class="func_des">通过交叉验证等手段检测存在安全漏洞的的开发框架，进一步检测分析，定位开发框架漏洞在模型中的具体层</div>
  </ifreme>

<ifreme @click.native="goFuncPage('/envTest')">
    <div slot="func_icon">
      <!-- 图片 -->
      <img class="icon_img" src="../assets/img/envTestIcon.png">
    </div>
    <!-- 功能名 -->
    <div slot="header" class="func_name">开发环境分析与框架适配</div>
    <!-- 功能描述 -->
    <div slot="des_func" class="func_des">对当前开发环境操作系统下的系统架构信息、依赖库版本、AI开发框架依赖与版本等关键信息进行分析与记录，检测其中的潜在漏洞问题</div>
  </ifreme>

<ifreme  @click.native="goFuncPage('/side')">
    <div slot="func_icon">
      <!-- 图片：待替换 -->
      <img class="icon_img" src="../assets/img/sideAnalysisIcon.png"> 
    </div>
    <!-- 功能名 -->
    <div slot="header" class="func_name">侧信道分析</div>
    <!-- 功能描述 -->
    <div slot="des_func" class="func_des">采集目标模型在目标平台上运行产生的功耗/电磁信息，形成曲线数据。输入功耗或电磁曲线数据文件，分别进行不同的侧信道攻击分析</div>
  </ifreme>
  <!-- 故障注入 -->
  <ifreme @click.native="goFuncPage('/inject')">
    <div slot="func_icon">
      <!-- 图片：待替换 -->
      <img class="icon_img" src="../assets/img/faultInjectIcon.png">
    </div>
    <!-- 功能名 -->
    <div slot="header" class="func_name">故障注入</div>
    <!-- 功能描述 -->
    <div slot="des_func" class="func_des">利用时钟毛刺故障对多种深度学习模型进行攻击，高精度故障注入评估过程使用可视化方式，展示故障攻击对深度学习模型输出的影响</div>
  </ifreme>
  <!-- 硬件优化 -->
  <ifreme @click.native="goFuncPage('/hardOpt')">
    <div slot="func_icon">
      <!-- 图片：待替换 -->
      <img class="icon_img" src="../assets/img/faultInjectIcon.png">
    </div>
    <!-- 功能名 -->
    <div slot="header" class="func_name">基于硬件优化的软硬件一体化验证</div>
    <!-- 功能描述 -->
    <div slot="des_func" class="func_des">从AI系统硬件运算效率的角度，实现AI系统软硬件的高效安全运行与智能驱动</div>
  </ifreme>

  