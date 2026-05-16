# 连接数据库

```mysql
# mysql -h 主机地址 -u 用户名  -p 用户密码	
mysql -hlocalhost -uroot -p
```

# 退出MySQL数据库

```mysql
exit（回车）
```
# 查看该数据库下的表

```sql
show tables;
```

# 修改用户密码

```mysql
# mysqladmin -u 用户名 -p 旧密码 password 新密码
mysqladmin -u root -password ab12;
```

# 创建数据库

```mysql
# create database <数据库名>
create database book
```

# 显示数据库

```mysql
show databases;
```

# 删除数据库

```mysql
# drop database <数据库名>
drop database company;
```

# 选择数据库

```mysql
# use <数据库名>
use company;
```

# 创建数据表

```mysql
drop table if exists com_bacteria_ndr_dict;
CREATE TABLE `com_bacteria_ndr_dict`
(
  `bacteria_code` varchar(32) NOT NULL COMMENT '细菌代码',
  `bacteria_name` varchar(256) NOT NULL COMMENT '细菌名称',
  `ab_code` varchar(32) NOT NULL COMMENT '抗菌药物代码',
  `ab_name` varchar(64) NOT NULL COMMENT '抗菌药物名称',
  `seq_no` int unsigned COMMENT '显示顺序号',
  `created_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后修改时间',
  PRIMARY KEY (`bacteria_code`,`ab_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

# 获取数据库表结构

```mysql
# desc <表名>;
desc user;
# 或者使用
show columns from user;
# 获取完整的数据库表结构
show full columns from user;
```

# 删除数据表

```mysql
# drop table <表名>	
drop table info;
# 如果该表存在就删除该表
drop table if exists company;
```

# 向数据表中插入数据

```mysql
# insert into <表名> [(字段名1)[,...字段名n])] value (值1）[,(值n)];
insert into student (id,name,age) value (1,'张三',13),(3, "王五", 28);
insert into student set id=2,name="李四",age=100;
# 有的话替换没有就新增
replace INTO `com_cl` (`cl_type_code`, `cl_type_name`, `cl_code`, `cl_name`, `cl_short_name`, `cl_name_en`, `module_code`, `module_name`, `seq_no`, `enable_flag`) 
VALUES 
('NCCtumourChannelType', 'NCC 肿瘤-患者类型', 'A', '住院', '住院', '住院', 'tumor', '肿瘤监测', 1, 1),
('NCCtumourChannelType', 'NCC 肿瘤-患者类型', 'O', '门诊', '门诊', '门诊', 'tumor', '肿瘤监测', 2, 1);
# 有的话忽略没有就新增
insert ignore INTO `sys_resource` (`resource_code`, `resource_name`, `resource_path`, `resource_type`, `module_code`, `module_name`, `icon`, `privilege`, `parent_code`, `status`, `seq`, `remark`) VALUES ('SyndromeWarning', '症候群预警', '/SyndromeWarning', 30, NULL, NULL, '', 'SyndromeWarning', 'reportAnalysis', 10, 100000249, '');
```

# 查询数据表中的数据

```mysql
# select <字段1，字段2，...> from <表名> where <条件>; 	
select * from student;
```

# 修改数据表中的数据

```mysql
# update 表名 set 字段=新值,... where 条件;	
update student set age=20 where id=1;
```

# 增加字段（添加列）:

```mysql
# alter table 表名 add 字段 类型 其他;	
alter table student add address varchar(40) default null;
```

# 修改字段

```sql
# alter table [表名] modify [字段名] [类型] comment '是否发送OA';
alter table msg_type_config modify oa_flag tinyint(3) unsigned comment '是否发送OA';
# 修改表名
alter table test_a rename to test_b;
# 修改表注释
alter table test_a comment 'test_a字段注释';
```

# 删除字段  (删除列) :

```mysql
alter table student drop column nickName;
```

# 加主关键字

```mysql
# alter table 表名 add primary key (字段名);	
alter table student add primary key (id);
```

# 加唯一限制条件

```mysql
# alter table 表名 add unique 索引名（字段名）;	
alter table student add unique emp_name2(id);
```

# 修改数据库表名

```mysql
# rename table 原表名 to 新表名;
rename table student to stu;
```

# 删除记录

```mysql
# delete from 表名 where 表达式;
delete from student where id=1;
```

# 导出数据库

```mysql
# mysqldump -u 用户名 -p 数据库名 > 导出的文件名
mysqldump -uroot -p  company > 123.sql
```

# 导出数据表

```mysql
# mysqldump -u 用户名 -p 数据库名 表名>导出的文件名
mysqldump -uroot -p company admin > outfile.sql
```

# 查看第n行后的m条记录

```mysql
# select * from <表名> limit row,rows;
select * from student limit n,m;
```

# 模糊查询

​	like

   %表示任意多个任意字符

   _ 表示一个任意字符

```sql
select * from t_student where c_name like '孙';
select * from t_student where c_name like '孙%';
select * from t_student where c_name like '孙_';
```

# 范围查询

in 表示在一个非连续的范围内 , 可以使用 or 实现

```
select * from t_students where id in(1,3,8);
select * from t_students where id =1 or id =3 or id =8);
```

FIND_IN_SET

> 用来匹配briefDepts字段中包含0111

```mysql
select id, name, depts from t_users where FIND_IN_SET('0111', t_users.briefDepts);
```

# 空判断

```sql
# 判断空值
select * from t_student where c_age is null;
# 判断非空值
select * from t_student where c_age is not null;
```

# 多字段排序

```sql
select * from t_student order by c_age desc,c_id asc;
```

# 关于事务

>  事务用于保证数据的一致性,它由一组相关的dml语句组成,该组的dml语句要么全部成功，要么全部失败。如:网上转账就是典型的要用事务来处理，用以保证数据的一致性。 

## 事务成功的案例

```mysql
CREATE DATABASE shop CHARACTER SET utf8 COLLATE utf8_general_ci;USE shop;CREATE TABLE `account`(  `id` INT(3) NOT NULL AUTO_INCREMENT,  `name` VARCHAR(30) NOT NULL,  `money` DECIMAL(9,2),  PRIMARY KEY (`id`))ENGINE=INNODB DEFAULT CHARSET=utf8;
INSERT INTO `account`(`name`,`money`) VALUES ('A',2000.00),('B',10000.00);
select * from `account`;--  模拟转账-- 手动处理事务
SET autocommit=0;      --  关闭自动提交
START TRANSACTION;      -- 开启一个事务（一组事务)
UPDATE `account` SET `money`=`money`-500 WHERE `name`='A';  -- A减500
UPDATE `account` SET `money`=`money`+500 WHERE `name`='B';  -- B加500-- 提交事务
COMMIT;-- 回滚：回到原来的样子（失败！）
ROLLBACK;-- 恢复默认值
SET autocommit=1;      --  开启自动提交
select * from `account`;  
```

此时rollback在commit之后，回滚失败，A成功转账给B。

注意：

+ 当我们开启(手动)事务之后，其后一系列操作并没有直接写入数据库，而是存入了事务日志，在运行到commit之前，重新启动一个新的客户端，查看account表的数据，发现account表的数据没有任何变化，如果我们选择提交事务，则将事务日志存储的记录直接更新到数据库，并清除事务日志；如果我们选择回滚事务，则直接将事务日志清除，所有在开启事务至回滚事务之间的操作失效，保持原有的数据库记录不变。
+ 当我们提交事务之后，再进行回滚事务是不起作用的，因为事务日志在提交事务的同时已经被清除啦！

 ## 失败的案例

将rollback置于commit之前，再进行一次转账，如下 :

```mysql
SET autocommit=0;      --  关闭自动提交
START TRANSACTION;      -- 开启一个事务（一组事务）
UPDATE `account` SET `money`=`money`-500 WHERE `name`='A'; -- A减500
UPDATE `account` SET `money`=`money`+500 WHERE `name`='B';  -- B加500-- 回滚：回到原来的样子
ROLLBACK;-- 提交事务
COMMIT;-- 恢复默认值
SET autocommit=1;      --  开启自动提交
select * from `account`;
```

 此时转账失败，表中的值不变。 

  ## 创建多个保存点（savepoint），回滚到某个保存点（rollback to） 

```mysql
start TRANSACTION; #开始一个事务          
SAVEPOINT a; # 做一个保存点a          
DELETE from account where name='B'; # 先删除一行记录         
SAVEPOINT b; #做一个保存点b          
update account set money=money+1000 where name='A'; # 修改A的字段值          
SAVEPOINT c; #做一个保存点c          
ROLLBACK to b; #回退到指定的某个保存点          
COMMIT;  #提交事务
```

  此时，name为B的记录以及被删除，而name为A的记录money没有增加1000。 

# 联表查询

## 左连接（LEFT JOIN）示例

```mysql
SELECT a.id,a.user_name, b.name FROM accounts as a LEFT JOIN account as b ON a.id = b.id WHERE a.id = '1';
```

