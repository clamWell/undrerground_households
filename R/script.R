
getwd();

install.packages("dplyr")
install.packages("ggplot2")

library(dplyr)
library(ggplot2)

seoul_basic = read.csv(file = "seoul_basic.csv", header = T,  stringsAsFactors = FALSE )
colnames(seoul_basic)
colnames(seoul_basic)[2] = "geo"
colnames(seoul_basic)[8] = "underFamilyRatio"
colnames(seoul_basic)[5] = "underFamilyCount"
colnames(seoul_basic)[7] = "underFamilyPop"
colnames(seoul_basic)[13] = "oldRatio"
colnames(seoul_basic)[15] = "SingleParentRatio"
head(seoul_basic)
tail(seoul_basic)
View(seoul_basic)
str(seoul_basic)
dim(seoul_basic)
summary(seoul_basic)

as.numeric(seoul_basic$underFamilyCount) ## , 로 인해서 작동하지 않음
seoul_basic$real_price = as.numeric(gsub(",", "", seoul_basic$real_price))
seoul_basic$pop = as.numeric(gsub(",", "", seoul_basic$pop))
seoul_basic$house = as.numeric(gsub(",", "", seoul_basic$house))
seoul_basic$under_house = as.numeric(gsub(",", "", seoul_basic$under_house))
seoul_basic$under_house_single = as.numeric(gsub(",", "", seoul_basic$under_house_single))
seoul_basic$old_pop = as.numeric(gsub(",", "", seoul_basic$old_pop))
seoul_basic$single_parent_house = as.numeric(gsub(",", "", seoul_basic$single_parent_house))
seoul_basic$low_income_house = as.numeric(gsub(",", "", seoul_basic$low_income_house))
 

box_plot_basic = boxplot(under_house_ratio)

plot_graph = ggplot(data=seoul_basic, aes(x=under_house_ratio, y=underFamilyCount))
plot_graph + geom_point(size=4, alpha=0.5, aes(color=underFamilyCount))

plot_graph_old = ggplot(data=seoul_basic, aes(x=under_house_ratio, y=old_ratio))
plot_graph_old + geom_point(alpha=0.7, aes(color=under_house_ratio, size=under_house))+geom_text_repel(aes(label=geo), size=3)

plot_low_income = ggplot(data=seoul_basic, aes(x=under_house_ratio, y=low_income_house_ratio))
plot_low_income + geom_point(alpha=0.7, aes(color=under_house_ratio,size=under_house))+geom_text_repel(aes(label=geo), size=3)

plot_graph_single = ggplot(data=seoul_basic, aes(x=under_house_ratio, y=single_parent_house_ratio))
plot_graph_single + geom_point(alpha=0.7, aes(color=under_house_ratio,size=under_house))+geom_text_repel(aes(label=geo), size=3)

plot_graph = ggplot(data=seoul_basic, aes(x=under_house_ratio, y=under_house))
plot_graph + geom_point(size=4, alpha=0.5, aes(color=under_house))

plot_graph_real = ggplot(data=seoul_basic, aes(x=under_house_ratio, y=real_price))
plot_graph_real + geom_point(alpha=0.5, aes(color=under_house_ratio, size=under_house))+geom_text_repel(aes(label=geo), size=3)

plot_graph_real_and_income = ggplot(data=seoul_basic, aes(x=low_income_house_ratio, y=real_price))
plot_graph_real_and_income + geom_point(alpha=0.5, aes(color=low_income_house_ratio, size=under_house_ratio))



install.packages("ggrepel")
library("ggrepel")

geo_full = read.csv(file = "geo_full.csv", header = T,  stringsAsFactors = FALSE )
colnames(geo_full)
str(geo_full)
geo_full$under_house = as.numeric(gsub(",", "", geo_full$under_house))
geo_full$pop = as.numeric(gsub(",", "", geo_full$pop))
geo_full$house = as.numeric(gsub(",", "", geo_full$house))
geo_full$under_pop = as.numeric(gsub(",", "", geo_full$under_pop))
geo_full$under_house_single = as.numeric(gsub(",", "", geo_full$under_house_single))

plot_graph_full = ggplot(data=geo_full, aes(x=under_house_ratio, y=under_house)) 
plot_graph_full + geom_point(alpha=0.5, aes(color=under_house_ratio, size=under_house))+ geom_text(aes(label=ifelse(under_house_ratio>6,as.character(geo),'')),hjust=0,vjust=0,fontface=2)


plot_graph_full + geom_point(alpha=0.5, aes(color=under_house_ratio, size=under_house))+geom_text_repel(aes(label=ifelse(under_house_ratio>6,as.character(geo),'')),size=3)

